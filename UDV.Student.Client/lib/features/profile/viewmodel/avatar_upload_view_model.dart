import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../data/profile_service.dart';
import 'profile_view_model.dart';

final imagePickerProvider = Provider<ImagePicker>((ref) => ImagePicker());

class AvatarUploadViewModel extends AsyncNotifier<void> {
  @override
  FutureOr<void> build() {}

  Future<void> pickAndUpload(ImageSource source) async {
    final picked = await ref.read(imagePickerProvider).pickImage(source: source);
    if (picked == null) return; // user cancelled

    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _upload(picked));
  }

  Future<void> _upload(XFile file) async {
    final service = ref.read(profileServiceProvider);

    final bytes = await file.readAsBytes();
    final contentType = _contentTypeFor(file.name);

    final ticket = await service.requestUploadUrl(
      fileName: file.name,
      contentType: contentType,
    );

    await service.uploadToStorage(
      uploadUrl: ticket.uploadUrl,
      bytes: bytes,
      contentType: contentType,
    );

    await service.confirmAvatar(ticket.objectKey);

    ref.invalidate(profileViewModelProvider);
  }

  String _contentTypeFor(String fileName) {
    return fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  }
}

final avatarUploadViewModelProvider = AsyncNotifierProvider<AvatarUploadViewModel, void>(
  AvatarUploadViewModel.new,
);
