# Gallery Video Strategy

## Current Support

The gallery supports mixed image and video albums through separate `galleryMedia` documents.

Short videos may be added as uploaded MP4, WebM, or MOV files in Sanity. Public playback uses visible controls, `preload="metadata"`, no autoplay, and poster images where available.

## External Providers

The CMS accepts YouTube and Vimeo URLs for externally hosted videos. Public pages avoid loading embedded players for every item up front; visitors open the video intentionally from the lightbox.

## Large Video Handling

The dry-run import found source videos above 100 MB. Those files are deferred and must not be uploaded blindly to Sanity file storage.

For large or frequent video publishing, the recommended future upgrade is Mux-backed delivery with Sanity references. That should be configured only after the school approves the hosting account, billing, and upload workflow.

## Current Limits

Use direct Sanity uploads for short clips only. Large videos should stay deferred until a production video-hosting decision is made.
