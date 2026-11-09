import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers/core_providers.dart';

class SessionViewModel extends AsyncNotifier<bool> {
  @override
  Future<bool> build() async {
    final token = await ref.read(tokenStorageProvider).readAccessToken();
    return token != null;
  }

  void markAuthenticated() => state = const AsyncData(true);

  Future<void> logout() async {
    await ref.read(tokenStorageProvider).clear();
    state = const AsyncData(false);
  }
}

final sessionProvider = AsyncNotifierProvider<SessionViewModel, bool>(
  SessionViewModel.new,
);
