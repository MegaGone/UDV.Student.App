import 'dart:typed_data';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;

import '../model/user_profile.dart';
import '../model/avatar_upload_ticket.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/providers/core_providers.dart';


class ProfileService {
  const ProfileService(this._api, this._http);

  final ApiClient _api;
  final http.Client _http;

  Future<UserProfile> getProfile() async {
    final json = await _api.get('/users/me', auth: true);
    return UserProfile.fromJson(json as Map<String, dynamic>);
  }

  Future<AvatarUploadTicket> requestUploadUrl({
    required String fileName,
    required String contentType,
  }) async {
    final json = await _api.post(
      '/users/me/avatar/upload-url',
      auth: true,
      body: {'fileName': fileName, 'contentType': contentType},
    );
    return AvatarUploadTicket.fromJson(json as Map<String, dynamic>);
  }

  Future<void> uploadToStorage({
    required String uploadUrl,
    required Uint8List bytes,
    required String contentType,
  }) async {
    final response = await _http.put(
      Uri.parse(uploadUrl),
      headers: {'Content-Type': contentType},
      body: bytes,
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(response.statusCode, 'Upload to storage failed.');
    }
  }

  Future<void> confirmAvatar(String objectKey) async {
    await _api.patch('/users/me/avatar', auth: true, body: {'objectKey': objectKey});
  }
}

final profileServiceProvider = Provider<ProfileService>(
  (ref) => ProfileService(
    ref.watch(apiClientProvider),
    ref.watch(httpClientProvider),
  ),
);
