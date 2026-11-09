class AvatarUploadTicket {
  const AvatarUploadTicket({required this.uploadUrl, required this.objectKey});

  final String uploadUrl;
  final String objectKey;

  factory AvatarUploadTicket.fromJson(Map<String, dynamic> json) => AvatarUploadTicket(
        uploadUrl: json['uploadUrl'] as String,
        objectKey: json['objectKey'] as String,
      );
}
