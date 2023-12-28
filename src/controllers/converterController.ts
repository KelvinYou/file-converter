import { Request, Response } from 'express';
import * as fs from 'fs';
import { typeMappings } from '../utils/typeMappings';
import { FileType, dir, inputFileName } from '../constants/common';
import HttpStatusCode from '../constants/httpStatusCode';

class ConverterController {
  convertTypeScriptToDart(req: Request, res: Response) {
    try {
      const inputFileContent = fs.readFileSync(inputFileName, 'utf8');

      // Extract the TypeScript interface and object
      const interfaceMatch = inputFileContent.match(/export interface (\w+) {([\s\S]*?)}/);

      if (!interfaceMatch) {
        console.error('Invalid TypeScript object file format');
        process.exit(1);
      }

      const interfaceName = interfaceMatch[1];
      const className = interfaceName;
      const properties = interfaceMatch[2].trim();

      // Generate Dart code
const dartCode = `
import 'package:cloud_firestore/cloud_firestore.dart';

class ${className} {
  ${properties.split(';').map(property => {
    if (property.trim()) {
      const [name, type] = property.trim().split(':');
      const dartType = typeMappings[type.trim()] || type.trim(); // Use typeMappings
      return `final ${dartType} ${name};`;
    } else {
      return '';
    }
  }).join('\n  ')}

  const ${className}({
    ${properties.split(';').map(property => {
      if (property.trim()) {
        const [name, type] = property.trim().split(':');
        const dartType = typeMappings[type.trim()] || type.trim(); // Use typeMappings
        return `required this.${name},`;
      } else {
        return '';
      }
    }).join('\n    ')}
  });

  static ${className} fromSnap(DocumentSnapshot snap) {
    var snapshot = snap.data() as Map<String, dynamic>;

    return ${className}(
      ${properties.split(';').map(property => {
        if (property.trim()) {
          const name = property.trim().split(':')[0];
          const type = property.trim().split(':')[1].trim();
          const dartType = typeMappings[type] || type;
          return `${name}: snapshot["${name}"],`;
        } else {
          return '';
        }
      }).join('\n      ')}
    );
  }

  Map<String, dynamic> toJson() => {
    ${properties.split(';').map(property => {
      if (property.trim()) {
        const name = property.trim().split(':')[0];
        return `"${name}": ${name},`;
      } else {
        return '';
      }
    }).join('\n    ')}
  };
}
`;
      const outputFileName = `${dir}/${className.toLowerCase()}.${FileType.Dart}`
      // Write Dart code to a file
      fs.writeFileSync(outputFileName, dartCode, 'utf8');

      console.log(`Dart code has been written to ${outputFileName}`);

      res.status(HttpStatusCode.OK).json({ message: 'Dart code generated successfully' });
    } catch (error) {
      console.error(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  }
}

export default ConverterController;
