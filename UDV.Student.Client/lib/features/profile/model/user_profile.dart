class UserProfile {
  const UserProfile({
    required this.id,
    required this.email,
    required this.username,
    required this.role,
    required this.avatarUrl,
  });

  final String id;
  final String email;
  final String username;
  final String role;

  final String? avatarUrl;

  bool get isAdmin => role == 'ADMIN';

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        id: json['id'] as String,
        email: json['email'] as String,
        username: json['username'] as String,
        role: json['role'] as String,
        avatarUrl: json['avatarUrl'] as String?,
      );
}
