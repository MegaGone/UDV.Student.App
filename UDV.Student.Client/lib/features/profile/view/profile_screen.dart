import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/config/app_assets.dart';
import '../../../core/network/error_messages.dart';
import '../../auth/view/register_screen.dart';
import '../../auth/viewmodel/session_view_model.dart';
import '../model/user_profile.dart';
import '../viewmodel/avatar_upload_view_model.dart';
import '../viewmodel/profile_view_model.dart';
import 'avatar_viewer_screen.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileViewModelProvider);
    final upload = ref.watch(avatarUploadViewModelProvider);

    // Muestra las fallas de subida como snackbar sin reconstruir la pantalla.
    ref.listen(avatarUploadViewModelProvider, (_, next) {
      if (next.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(mensajeDeError(next.error!))),
        );
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Image.asset(AppAssets.logo, height: 36),
        actions: [
          // Solo admin: atajo para crear un nuevo usuario.
          if (profile.asData?.value.isAdmin ?? false)
            IconButton(
              icon: const Icon(Icons.person_add),
              tooltip: 'Crear usuario',
              onPressed: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const RegisterScreen()),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Cerrar sesión',
            onPressed: () {
              // Limpia el estado del usuario anterior para que el próximo login recargue.
              ref.invalidate(profileViewModelProvider);
              ref.invalidate(avatarUploadViewModelProvider);
              ref.read(sessionProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: profile.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => _ErrorView(
          message: mensajeDeError(error),
          onRetry: () => ref.invalidate(profileViewModelProvider),
        ),
        data: (user) => _ProfileBody(
          user: user,
          isUploading: upload.isLoading,
          onPick: (source) =>
              ref.read(avatarUploadViewModelProvider.notifier).pickAndUpload(source),
        ),
      ),
    );
  }
}

class _ProfileBody extends StatelessWidget {
  const _ProfileBody({
    required this.user,
    required this.isUploading,
    required this.onPick,
  });

  final UserProfile user;
  final bool isUploading;
  final ValueChanged<ImageSource> onPick;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            GestureDetector(
              onTap: user.avatarUrl == null ? null : () => _openViewer(context),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  CircleAvatar(
                    radius: 64,
                    backgroundImage:
                        user.avatarUrl != null ? NetworkImage(user.avatarUrl!) : null,
                    child: user.avatarUrl == null
                        ? const Icon(Icons.person, size: 64)
                        : null,
                  ),
                  if (isUploading) const CircularProgressIndicator(),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(user.username, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 4),
            Text(user.email, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 32),
            FilledButton.icon(
              onPressed: isUploading ? null : () => _showSourceSheet(context),
              icon: const Icon(Icons.photo_camera),
              label: const Text('Cambiar foto'),
            ),
          ],
        ),
      ),
    );
  }

  void _openViewer(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => AvatarViewerScreen(imageUrl: user.avatarUrl!),
      ),
    );
  }

  void _showSourceSheet(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      builder: (sheetContext) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.photo_camera),
              title: const Text('Tomar una foto'),
              onTap: () {
                Navigator.pop(sheetContext);
                onPick(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Elegir de la galería'),
              onTap: () {
                Navigator.pop(sheetContext);
                onPick(ImageSource.gallery);
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          OutlinedButton(onPressed: onRetry, child: const Text('Reintentar')),
        ],
      ),
    );
  }
}
