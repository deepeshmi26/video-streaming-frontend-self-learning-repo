# Chapter 00 — Basic Video Player

In this chapter, we build the simplest video player using the native HTML5 `<video>` element with an MP4 file.

```html
<video controls>
  <source src="movie.mp4" type="video/mp4" />
</video>


## Why not use native browser streaming?

While browsers can stream video natively using the `<video>` tag, there are several limitations:

1. **No Adaptive Bitrate**: Native streaming can't automatically switch quality based on network conditions
2. **Limited Buffer Control**: No control over how much video is buffered
3. **Inefficient for Live**: Not optimized for live streaming scenarios
4. **Cross-Browser Issues**: Inconsistent streaming support across browsers
5. **CDN Limitations**: Can't take full advantage of CDN caching without proper segmentation

For production video streaming, protocols like HLS or DASH are preferred as they solve these limitations while providing better scalability and user experience.
