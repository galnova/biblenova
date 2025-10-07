// src/utils/pickVOD.ts
export const VOD_REFERENCES = [
  "John 3:16",
  "Psalm 23:1",
  "Jeremiah 29:11",
  "Philippians 4:6-7",
  "Romans 8:28",
  "Proverbs 3:5-6",
  "Isaiah 41:10",
  "Matthew 11:28-30",
  "Psalm 119:105",
  "1 Corinthians 13:4-7",
  "Romans 12:2",
  "Ephesians 2:8-9",
  "Joshua 1:9",
  "Hebrews 11:1",
  "James 1:5",
  "1 Peter 5:7",
  "2 Timothy 1:7",
  "Galatians 5:22-23",
  "Romans 5:8",
  "Psalm 27:1",
  "Proverbs 18:10",
  "Psalm 46:1",
  "1 John 1:9",
  "Psalm 34:8",
  "Romans 10:9",
  "Matthew 6:33",
  "Colossians 3:23-24",
  "Psalm 121:1-2",
  "Isaiah 40:31",
  "Song of Solomon 2:1",
  "Micah 6:8",
];

export function pickVOD(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((+date - +start) / 86400000);
  return VOD_REFERENCES[day % VOD_REFERENCES.length];
}
