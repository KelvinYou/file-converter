import * as fs from 'fs';

// Read the TypeScript object file
const inputFileName = 'input.ts';
const inputFileContent = fs.readFileSync(inputFileName, 'utf8');
// Extract the TypeScript interface and object
const interfaceMatch = inputFileContent.match(/export interface (\w+) {([\s\S]*?)}/);

if (!interfaceMatch) {
  console.error('Invalid TypeScript object file format');
  process.exit(1);
}

const typeMappings: Record<string, string> = {
  string: 'String',
  number: 'double',
  boolean: 'bool',
  any: 'dynamic',
  void: 'void',
  null: 'Null',
  undefined: 'dynamic',
  'Array<string>': 'List<String>',
  'Array<number>': 'List<double>',
  'Array<boolean>': 'List<bool>',
  'Array<any>': 'List<dynamic>',
  object: 'Map<String, dynamic>',
  Date: 'DateTime',
  'string[]': 'List<String>',
};

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

// Write Dart code to a file
const outputFileName = 'output.dart';
fs.writeFileSync(outputFileName, dartCode, 'utf8');

console.log(`Dart code has been written to ${outputFileName}`);
