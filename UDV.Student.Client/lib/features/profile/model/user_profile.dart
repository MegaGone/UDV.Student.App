class UserProfile {
  const UserProfile({
    required this.id,
    required this.email,
    required this.username,
    required this.avatarUrl,
  });

  final String id;
  final String email;
  final String username;

  final String? avatarUrl;

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        id: json['id'] as String,
        email: json['email'] as String,
        username: json['username'] as String,
        avatarUrl: json['avatarUrl'] as String?,
      );
}
