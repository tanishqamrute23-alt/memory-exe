export interface Song {
  id: number;
  title: string;
  artist: string;
  year: number;
  videoId: string;
  duration?: string;
}

export const songs: Song[] = [
  { id: 1, title: "Pehla Nasha", artist: "Udit Narayan, Sadhana Sargam", year: 1992, videoId: "Ki41AKu0iHc", duration: "04:51" },
  { id: 2, title: "Ek Ladki Ko Dekha", artist: "Kumar Sanu", year: 1994, videoId: "H5sheEWfsOQ", duration: "04:35" },
  { id: 3, title: "Koi Mil Gaya", artist: "Udit Narayan, Alka Yagnik, Kavita Krishnamurthy", year: 1998, videoId: "Jzd4bma3QNo", duration: "07:14" },
  { id: 4, title: "You Are My Soniya", artist: "Sonu Nigam, Alka Yagnik", year: 2001, videoId: "rgEZx78AF3o", duration: "05:45" },
  { id: 5, title: "Kya Mujhe Pyaar Hai", artist: "KK", year: 2006, videoId: "lrAM_H7v8wM", duration: "04:26" },
  { id: 6, title: "Suraj Hua Maddham", artist: "Sonu Nigam & Alka Yagnik", year: 2001, videoId: "L0zKs8i7Nc8", duration: "07:08" },
  { id: 7, title: "Mitwa", artist: "Shafqat Amanat Ali, Caralisa Monteiro, Shankar Mahadevan", year: 2006, videoId: "XllMnMHdiLE", duration: "06:22" },
  { id: 8, title: "Pehli Nazar Mein", artist: "Atif Aslam", year: 2008, videoId: "MofpuI_Vg_U", duration: "05:13" },
  { id: 9, title: "Chand Taare", artist: "Abhijeet Bhattacharya", year: 1997, videoId: "N3QzaUwml5w", duration: "04:48" },
  { id: 10, title: "Main Koi Aisa Geet Gaoon", artist: "Abhijeet Bhattacharya, Alka Yagnik", year: 1997, videoId: "vzlXfZlH5dk", duration: "05:11" },
  { id: 11, title: "Ek Din Aap Yun", artist: "Kumar Sanu, Alka Yagnik", year: 1997, videoId: "lOyRBSy4Q_g", duration: "04:52" },
  { id: 12, title: "Suno Na Suno Na", artist: "Abhijeet Bhattacharya", year: 2003, videoId: "9hrV2IFsx5s", duration: "05:22" },
  { id: 13, title: "Aankhein Khuli", artist: "Manohar Shetty, Udit Narayan, Shah Rukh Khan, Lata Mangeshkar", year: 2000, videoId: "eM8Mjuq4MwQ", duration: "07:02" },
  { id: 14, title: "Bholi Si Surat", artist: "Udit Narayan, Lata Mangeshkar", year: 1997, videoId: "kOvXnRCo1xo", duration: "04:16" },
  { id: 15, title: "Koi Ladki Hai", artist: "Udit Narayan, Lata Mangeshkar", year: 1997, videoId: "u6bk53x2Kno", duration: "05:32" },
  { id: 16, title: "Dholna", artist: "Udit Narayan, Lata Mangeshkar", year: 1997, videoId: "bWNkpJdkOj4", duration: "05:20" },
  { id: 17, title: "Badi Mushkil Hai", artist: "Abhijeet Bhattacharya", year: 1994, videoId: "FKbX2c2UkjY", duration: "05:30" },
  { id: 18, title: "Tum Se Hi", artist: "Mohit Chauhan", year: 2007, videoId: "mt9xg0mmt28", duration: "05:23" }
];
