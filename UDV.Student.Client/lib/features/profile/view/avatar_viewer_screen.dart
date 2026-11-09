import 'package:flutter/material.dart';

/// Full-screen, zoomable viewer for the avatar image.
class AvatarViewerScreen extends StatelessWidget {
  const AvatarViewerScreen({super.key, required this.imageUrl});

  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Center(
        child: InteractiveViewer(
          minScale: 1,
          maxScale: 5,
          child: Image.network(
            imageUrl,
            fit: BoxFit.contain,
            loadingBuilder: (context, child, progress) => progress == null
                ? child
                : const CircularProgressIndicator(),
            errorBuilder: (context, _, _) => const Icon(
              Icons.broken_image,
              color: Colors.white,
              size: 64,
            ),
          ),
        ),
      ),
    );
  }
}
