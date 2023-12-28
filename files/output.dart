
import 'package:cloud_firestore/cloud_firestore.dart';

class Post {
  final String postId;
  final String userId;
  final String title;
  final String description;
  final List<String> tags;
  final DateTime createDate;
  

  const Post({
    required this.postId,
    required this.userId,
    required this.title,
    required this.description,
    required this.tags,
    required this.createDate,
    
  });

  static Post fromSnap(DocumentSnapshot snap) {
    var snapshot = snap.data() as Map<String, dynamic>;

    return Post(
      postId: snapshot["postId"],
      userId: snapshot["userId"],
      title: snapshot["title"],
      description: snapshot["description"],
      tags: snapshot["tags"],
      createDate: snapshot["createDate"],
      
    );
  }

  Map<String, dynamic> toJson() => {
    "postId": postId,
    "userId": userId,
    "title": title,
    "description": description,
    "tags": tags,
    "createDate": createDate,
    
  };
}
