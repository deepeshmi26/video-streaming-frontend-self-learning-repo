/**
 * Converts VTT timestamp to seconds
 * @param {string} time - VTT timestamp in format HH:MM:SS.mmm
 * @returns {number} Time in seconds
 */
const toSeconds = (time) => {
  const [h, m, rest] = time.split(":");
  const [s] = rest.split(".");
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
};

/**
 * Parses VTT file for thumbnail information
 * @param {string} url - URL of the VTT file
 * @returns {Promise<Array<{start: number, end: number, x: number, y: number, w: number, h: number, url: string}>>}
 */
export const parseVTT = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split("\n").filter(Boolean);
  const cues = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("-->")) {
      const [start, end] = lines[i].split("-->").map((s) => s.trim());
      const coordsLine = lines[i + 1];
      const match = coordsLine.match(/#xywh=(\d+),(\d+),(\d+),(\d+)/);
      if (match) {
        cues.push({
          start: toSeconds(start),
          end: toSeconds(end),
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
          w: parseInt(match[3], 10),
          h: parseInt(match[4], 10),
          url: coordsLine.split("#")[0],
        });
      }
    }
  }
  return cues;
};
