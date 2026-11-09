import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../model/user_profile.dart';
import '../data/profile_service.dart';

class ProfileViewModel extends AsyncNotifier<UserProfile> {
  @override
  Future<UserProfile> build() {
    return ref.read(profileServiceProvider).getProfile();
  }
}

final profileViewModelProvider = AsyncNotifierProvider<ProfileViewModel, UserProfile>(
  ProfileViewModel.new,
);
