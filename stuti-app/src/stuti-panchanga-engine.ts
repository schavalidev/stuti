import { STUTI_EPHEM } from "./stuti-ephemeris";
import { ayanSys, reckoning } from "./stuti-reckoning";

/* ============================================================
   AKSHARA — Pañcāṅga engine
   Location-aware almanac, computed rather than illustrated. Nothing
   here is a cyclic stand-in any more: STUTI_EPHEM supplies the
   apparent longitudes of the sun and the moon, and every limb is
   arithmetic on those two angles, read at the day's own sunrise.

     • vāra                      — the civil date
     • sunrise / sunset / rāhu / durmuhūrta
                                 — the ephemeris sun on the horizon,
                                   for the location's lat / lon / tz
     • tithi · nakṣatra · yoga · karaṇa
                                 — sidereal longitudes, each with the
                                   hour it began and the hour it turns
     • māsa · adhika · kṣaya · ṛtu · ayana
                                 — the rāśi the sun held at the new
                                   moon that opened the month
     • saṁvatsara · śaka · vikrama
                                 — the lunar year, counted from its
                                   own Caitra new moon

   Drik or vākya is the reciter's choice; the ephemeris holds it and
   every limb below follows whichever is in force.
   ============================================================ */
export const AKSHARA_PANCHANGA = (function () {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const TWO_PI = Math.PI * 2;

  /* ---------- Locations ----------
     lat, lon°E, tz = STANDARD offset in hours, zone = IANA name.
     The zone is what actually drives the clock: effTz() asks the
     platform for the true offset on the day in question, so summer
     time is handled wherever the reciter is. top:1 = shown before
     the reciter types anything.
     ---------------------------------------------------------- */
  const locations = [
    { id: "delhi", city: "New Delhi", region: "Delhi, India", lat: 28.61, lon: 77.21, tz: 5.5, zone: "Asia/Kolkata", top: 1, alt: "Delhi NCR" },
    { id: "mumbai", city: "Mumbai", region: "Mahārāṣṭra, India", lat: 19.08, lon: 72.88, tz: 5.5, zone: "Asia/Kolkata", top: 1, alt: "Bombay" },
    { id: "bengaluru", city: "Bengaluru", region: "Karnāṭaka, India", lat: 12.97, lon: 77.59, elev: 920, tz: 5.5, zone: "Asia/Kolkata", top: 1, alt: "Bangalore" },
    { id: "hyderabad", city: "Hyderabad", region: "Telaṅgāṇa, India", lat: 17.39, lon: 78.49, elev: 505, tz: 5.5, zone: "Asia/Kolkata", top: 1 },
    { id: "chennai", city: "Chennai", region: "Tamil Nāḍu, India", lat: 13.08, lon: 80.27, tz: 5.5, zone: "Asia/Kolkata", top: 1, alt: "Madras" },
    { id: "kolkata", city: "Kolkata", region: "West Bengal, India", lat: 22.57, lon: 88.36, tz: 5.5, zone: "Asia/Kolkata", top: 1, alt: "Calcutta" },
    { id: "pune", city: "Pune", region: "Mahārāṣṭra, India", lat: 18.52, lon: 73.86, elev: 560, tz: 5.5, zone: "Asia/Kolkata", alt: "Poona" },
    { id: "ahmedabad", city: "Ahmedabad", region: "Gujarāt, India", lat: 23.02, lon: 72.57, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "surat", city: "Surat", region: "Gujarāt, India", lat: 21.17, lon: 72.83, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "jaipur", city: "Jaipur", region: "Rājasthān, India", lat: 26.91, lon: 75.79, elev: 431, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "lucknow", city: "Lucknow", region: "Uttar Pradesh, India", lat: 26.85, lon: 80.95, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "kanpur", city: "Kanpur", region: "Uttar Pradesh, India", lat: 26.45, lon: 80.33, tz: 5.5, zone: "Asia/Kolkata", alt: "Cawnpore" },
    { id: "nagpur", city: "Nāgpur", region: "Mahārāṣṭra, India", lat: 21.15, lon: 79.09, tz: 5.5, zone: "Asia/Kolkata", alt: "Nagpur" },
    { id: "indore", city: "Indore", region: "Madhya Pradesh, India", lat: 22.72, lon: 75.86, elev: 550, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "bhopal", city: "Bhopāl", region: "Madhya Pradesh, India", lat: 23.26, lon: 77.41, elev: 500, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "patna", city: "Patnā", region: "Bihār, India", lat: 25.59, lon: 85.14, tz: 5.5, zone: "Asia/Kolkata", alt: "Patna Pataliputra" },
    { id: "vadodara", city: "Vadodara", region: "Gujarāt, India", lat: 22.31, lon: 73.18, tz: 5.5, zone: "Asia/Kolkata", alt: "Baroda" },
    { id: "rajkot", city: "Rājkot", region: "Gujarāt, India", lat: 22.3, lon: 70.8, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "ludhiana", city: "Ludhiānā", region: "Punjab, India", lat: 30.9, lon: 75.86, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "amritsar", city: "Amritsar", region: "Punjab, India", lat: 31.63, lon: 74.87, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "chandigarh", city: "Chandīgarh", region: "Punjab & Haryāṇā, India", lat: 30.73, lon: 76.78, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "gurugram", city: "Gurugrām", region: "Haryāṇā, India", lat: 28.46, lon: 77.03, tz: 5.5, zone: "Asia/Kolkata", alt: "Gurgaon" },
    { id: "noida", city: "Noida", region: "Uttar Pradesh, India", lat: 28.54, lon: 77.39, tz: 5.5, zone: "Asia/Kolkata", alt: "Noida Greater Noida" },
    { id: "meerut", city: "Meerut", region: "Uttar Pradesh, India", lat: 28.98, lon: 77.71, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "agra", city: "Āgrā", region: "Uttar Pradesh, India", lat: 27.18, lon: 78.01, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "gwalior", city: "Gwālior", region: "Madhya Pradesh, India", lat: 26.22, lon: 78.18, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "jabalpur", city: "Jabalpur", region: "Madhya Pradesh, India", lat: 23.18, lon: 79.99, elev: 411, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "raipur", city: "Rāipur", region: "Chhattīsgarh, India", lat: 21.25, lon: 81.63, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "bilaspur", city: "Bilāspur", region: "Chhattīsgarh, India", lat: 22.08, lon: 82.15, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "ranchi", city: "Rānchī", region: "Jhārkhaṇḍ, India", lat: 23.34, lon: 85.31, elev: 651, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "jamshedpur", city: "Jamshedpur", region: "Jhārkhaṇḍ, India", lat: 22.8, lon: 86.18, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "bhubaneswar", city: "Bhubaneśvar", region: "Odisha, India", lat: 20.3, lon: 85.82, tz: 5.5, zone: "Asia/Kolkata", alt: "Bhubaneshwar" },
    { id: "cuttack", city: "Cuttack", region: "Odisha, India", lat: 20.46, lon: 85.88, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "guwahati", city: "Guwāhāṭī", region: "Assam, India", lat: 26.14, lon: 91.74, tz: 5.5, zone: "Asia/Kolkata", alt: "Gauhati Kamakhya" },
    { id: "shillong", city: "Shillong", region: "Meghālaya, India", lat: 25.58, lon: 91.89, elev: 1496, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "agartala", city: "Agartalā", region: "Tripurā, India", lat: 23.83, lon: 91.28, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "imphal", city: "Imphāl", region: "Maṇipur, India", lat: 24.82, lon: 93.94, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "aizawl", city: "Aizawl", region: "Mizoram, India", lat: 23.73, lon: 92.72, elev: 1132, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "kohima", city: "Kohimā", region: "Nāgāland, India", lat: 25.67, lon: 94.11, elev: 1444, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "itanagar", city: "Itānagar", region: "Aruṇāchal Pradesh, India", lat: 27.08, lon: 93.61, elev: 440, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "gangtok", city: "Gangtok", region: "Sikkim, India", lat: 27.33, lon: 88.61, elev: 1650, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "siliguri", city: "Siligurī", region: "West Bengal, India", lat: 26.73, lon: 88.4, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "srinagar", city: "Srīnagar", region: "Jammu & Kashmīr, India", lat: 34.08, lon: 74.8, elev: 1585, tz: 5.5, zone: "Asia/Kolkata", alt: "Srinagar Kashmir" },
    { id: "jammu", city: "Jammu", region: "Jammu & Kashmīr, India", lat: 32.73, lon: 74.87, tz: 5.5, zone: "Asia/Kolkata", alt: "Jammu" },
    { id: "katra", city: "Katrā", region: "Jammu & Kashmīr, India", lat: 32.99, lon: 74.95, tz: 5.5, zone: "Asia/Kolkata", alt: "Katra Vaishno Devi" },
    { id: "shimla", city: "Shimlā", region: "Himāchal Pradesh, India", lat: 31.1, lon: 77.17, elev: 2276, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "dehradun", city: "Dehrādūn", region: "Uttarākhaṇḍ, India", lat: 30.32, lon: 78.03, elev: 640, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "haridwar", city: "Haridvār", region: "Uttarākhaṇḍ, India", lat: 29.95, lon: 78.16, tz: 5.5, zone: "Asia/Kolkata", alt: "Hardwar" },
    { id: "rishikesh", city: "Ṛṣikeśa", region: "Uttarākhaṇḍ, India", lat: 30.09, lon: 78.27, tz: 5.5, zone: "Asia/Kolkata", alt: "Rishikesh Hrishikesh" },
    { id: "badrinath", city: "Badrīnāth", region: "Uttarākhaṇḍ, India", lat: 30.74, lon: 79.49, elev: 3133, tz: 5.5, zone: "Asia/Kolkata", alt: "Badrinath Badri" },
    { id: "kedarnath", city: "Kedārnāth", region: "Uttarākhaṇḍ, India", lat: 30.73, lon: 79.07, elev: 3583, tz: 5.5, zone: "Asia/Kolkata", alt: "Kedarnath Kedar" },
    { id: "varanasi", city: "Vārāṇasī", region: "Uttar Pradesh, India", lat: 25.32, lon: 83.01, tz: 5.5, zone: "Asia/Kolkata", top: 1, alt: "Benares Banaras Kashi Kāśī" },
    { id: "prayagraj", city: "Prayāgrāj", region: "Uttar Pradesh, India", lat: 25.44, lon: 81.85, tz: 5.5, zone: "Asia/Kolkata", alt: "Allahabad Prayag" },
    { id: "ayodhya", city: "Ayodhyā", region: "Uttar Pradesh, India", lat: 26.8, lon: 82.2, tz: 5.5, zone: "Asia/Kolkata", alt: "Ayodhya Saket" },
    { id: "mathura", city: "Mathurā", region: "Uttar Pradesh, India", lat: 27.49, lon: 77.67, tz: 5.5, zone: "Asia/Kolkata", alt: "Brij Braj" },
    { id: "vrindavan", city: "Vṛndāvana", region: "Uttar Pradesh, India", lat: 27.58, lon: 77.7, tz: 5.5, zone: "Asia/Kolkata", alt: "Vrindavan Brindavan" },
    { id: "gorakhpur", city: "Gorakhpur", region: "Uttar Pradesh, India", lat: 26.76, lon: 83.37, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "chitrakoot", city: "Citrakūṭa", region: "Uttar Pradesh, India", lat: 25.2, lon: 80.86, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "gaya", city: "Gayā", region: "Bihār, India", lat: 24.79, lon: 85, tz: 5.5, zone: "Asia/Kolkata", alt: "Gaya Bodh Gaya" },
    { id: "deoghar", city: "Deoghar", region: "Jhārkhaṇḍ, India", lat: 24.48, lon: 86.7, tz: 5.5, zone: "Asia/Kolkata", alt: "Deoghar Baidyanath" },
    { id: "puri", city: "Purī", region: "Odisha, India", lat: 19.81, lon: 85.83, tz: 5.5, zone: "Asia/Kolkata", alt: "Puri Jagannath" },
    { id: "kurukshetra", city: "Kurukṣetra", region: "Haryāṇā, India", lat: 29.97, lon: 76.88, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "ujjain", city: "Ujjain", region: "Madhya Pradesh, India", lat: 23.18, lon: 75.78, elev: 494, tz: 5.5, zone: "Asia/Kolkata", top: 1, alt: "Avantika Mahakal" },
    { id: "omkareshwar", city: "Oṁkāreśvara", region: "Madhya Pradesh, India", lat: 22.24, lon: 76.15, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "udaipur", city: "Udaipur", region: "Rājasthān, India", lat: 24.58, lon: 73.71, elev: 598, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "ajmer", city: "Ajmer", region: "Rājasthān, India", lat: 26.45, lon: 74.64, elev: 480, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "pushkar", city: "Puṣkara", region: "Rājasthān, India", lat: 26.49, lon: 74.55, elev: 510, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "nathdwara", city: "Nāthdvārā", region: "Rājasthān, India", lat: 24.94, lon: 73.82, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "jodhpur", city: "Jodhpur", region: "Rājasthān, India", lat: 26.24, lon: 73.02, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "bikaner", city: "Bīkāner", region: "Rājasthān, India", lat: 28.02, lon: 73.31, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "kota", city: "Koṭā", region: "Rājasthān, India", lat: 25.21, lon: 75.86, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "dwarka", city: "Dvārakā", region: "Gujarāt, India", lat: 22.24, lon: 68.97, tz: 5.5, zone: "Asia/Kolkata", alt: "Dwaraka Dwarika" },
    { id: "somnath", city: "Somanātha", region: "Gujarāt, India", lat: 20.89, lon: 70.4, tz: 5.5, zone: "Asia/Kolkata", alt: "Somnath Prabhas Patan" },
    { id: "nashik", city: "Nāsik", region: "Mahārāṣṭra, India", lat: 20.01, lon: 73.79, elev: 700, tz: 5.5, zone: "Asia/Kolkata", alt: "Nasik Nashik Trimbak" },
    { id: "shirdi", city: "Shirḍī", region: "Mahārāṣṭra, India", lat: 19.77, lon: 74.48, tz: 5.5, zone: "Asia/Kolkata", alt: "Shirdi Sai" },
    { id: "pandharpur", city: "Paṇḍharpur", region: "Mahārāṣṭra, India", lat: 17.68, lon: 75.33, tz: 5.5, zone: "Asia/Kolkata", alt: "Pandharpur Vitthal" },
    { id: "kolhapur", city: "Kolhāpur", region: "Mahārāṣṭra, India", lat: 16.7, lon: 74.24, elev: 545, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "solapur", city: "Solāpur", region: "Mahārāṣṭra, India", lat: 17.66, lon: 75.91, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "nanded", city: "Nānded", region: "Mahārāṣṭra, India", lat: 19.15, lon: 77.32, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "chhatrapatisambhajinagar", city: "Chhatrapati Sambhājīnagar", region: "Mahārāṣṭra, India", lat: 19.88, lon: 75.34, tz: 5.5, zone: "Asia/Kolkata", alt: "Aurangabad" },
    { id: "thane", city: "Ṭhāṇe", region: "Mahārāṣṭra, India", lat: 19.22, lon: 72.98, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "panaji", city: "Panajī", region: "Goa, India", lat: 15.5, lon: 73.83, tz: 5.5, zone: "Asia/Kolkata", alt: "Panjim Goa" },
    { id: "visakhapatnam", city: "Viśākhapaṭnam", region: "Āndhra Pradesh, India", lat: 17.69, lon: 83.22, tz: 5.5, zone: "Asia/Kolkata", alt: "Vizag Vishakhapatnam Waltair" },
    { id: "vijayawada", city: "Vijayavāḍa", region: "Āndhra Pradesh, India", lat: 16.51, lon: 80.65, tz: 5.5, zone: "Asia/Kolkata", alt: "Bezawada" },
    { id: "tirupati", city: "Tirupati", region: "Āndhra Pradesh, India", lat: 13.63, lon: 79.42, tz: 5.5, zone: "Asia/Kolkata", top: 1, alt: "Tirumala Tirupathi Balaji" },
    { id: "guntur", city: "Guṇṭūr", region: "Āndhra Pradesh, India", lat: 16.31, lon: 80.44, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "nellore", city: "Nellore", region: "Āndhra Pradesh, India", lat: 14.44, lon: 79.99, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "rajahmundry", city: "Rājamahendravaram", region: "Āndhra Pradesh, India", lat: 17, lon: 81.78, tz: 5.5, zone: "Asia/Kolkata", alt: "Rajahmundry Rajamundry" },
    { id: "kakinada", city: "Kākināḍa", region: "Āndhra Pradesh, India", lat: 16.99, lon: 82.25, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "annavaram", city: "Annavaram", region: "Āndhra Pradesh, India", lat: 17.28, lon: 82.4, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "srisailam", city: "Śrīśailam", region: "Āndhra Pradesh, India", lat: 16.07, lon: 78.87, tz: 5.5, zone: "Asia/Kolkata", alt: "Srisailam Mallikarjuna" },
    { id: "kalahasti", city: "Śrīkālahasti", region: "Āndhra Pradesh, India", lat: 13.75, lon: 79.7, tz: 5.5, zone: "Asia/Kolkata", alt: "Kalahasti Sri Kalahasti" },
    { id: "warangal", city: "Warangal", region: "Telaṅgāṇa, India", lat: 17.97, lon: 79.59, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "karimnagar", city: "Karīmnagar", region: "Telaṅgāṇa, India", lat: 18.44, lon: 79.13, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "nizamabad", city: "Nizāmābād", region: "Telaṅgāṇa, India", lat: 18.67, lon: 78.09, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "bhadrachalam", city: "Bhadrācalam", region: "Telaṅgāṇa, India", lat: 17.67, lon: 80.89, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "mysuru", city: "Mysūru", region: "Karṇāṭaka, India", lat: 12.3, lon: 76.64, elev: 770, tz: 5.5, zone: "Asia/Kolkata", alt: "Mysore" },
    { id: "mangaluru", city: "Mangalūru", region: "Karṇāṭaka, India", lat: 12.91, lon: 74.86, tz: 5.5, zone: "Asia/Kolkata", alt: "Mangalore" },
    { id: "hubballi", city: "Hubbaḷḷi", region: "Karṇāṭaka, India", lat: 15.36, lon: 75.12, elev: 670, tz: 5.5, zone: "Asia/Kolkata", alt: "Hubli Dharwad" },
    { id: "belagavi", city: "Belagāvi", region: "Karṇāṭaka, India", lat: 15.85, lon: 74.5, elev: 751, tz: 5.5, zone: "Asia/Kolkata", alt: "Belgaum" },
    { id: "kalaburagi", city: "Kalaburagi", region: "Karṇāṭaka, India", lat: 17.33, lon: 76.83, elev: 454, tz: 5.5, zone: "Asia/Kolkata", alt: "Gulbarga" },
    { id: "shivamogga", city: "Śivamogga", region: "Karṇāṭaka, India", lat: 13.93, lon: 75.57, elev: 569, tz: 5.5, zone: "Asia/Kolkata", alt: "Shimoga" },
    { id: "udupi", city: "Uḍupi", region: "Karṇāṭaka, India", lat: 13.34, lon: 74.75, tz: 5.5, zone: "Asia/Kolkata", alt: "Udipi" },
    { id: "sringeri", city: "Śṛṅgeri", region: "Karṇāṭaka, India", lat: 13.42, lon: 75.25, elev: 671, tz: 5.5, zone: "Asia/Kolkata", alt: "Sringeri Shringeri Sharada" },
    { id: "gokarna", city: "Gokarṇa", region: "Karṇāṭaka, India", lat: 14.55, lon: 74.32, tz: 5.5, zone: "Asia/Kolkata", alt: "Gokarna Gokarn" },
    { id: "hampi", city: "Hampi", region: "Karṇāṭaka, India", lat: 15.34, lon: 76.46, elev: 467, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "coimbatore", city: "Coimbatore", region: "Tamil Nāḍu, India", lat: 11.02, lon: 76.96, elev: 411, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "madurai", city: "Madurai", region: "Tamil Nāḍu, India", lat: 9.93, lon: 78.12, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "tiruchirappalli", city: "Tiruchirāppaḷḷi", region: "Tamil Nāḍu, India", lat: 10.79, lon: 78.7, tz: 5.5, zone: "Asia/Kolkata", alt: "Trichy Trichinopoly Srirangam" },
    { id: "salem", city: "Salem", region: "Tamil Nāḍu, India", lat: 11.66, lon: 78.15, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "tirunelveli", city: "Tirunelveli", region: "Tamil Nāḍu, India", lat: 8.71, lon: 77.76, tz: 5.5, zone: "Asia/Kolkata", alt: "Nellai Tirunelveli" },
    { id: "vellore", city: "Vellore", region: "Tamil Nāḍu, India", lat: 12.92, lon: 79.13, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "thanjavur", city: "Thanjāvūr", region: "Tamil Nāḍu, India", lat: 10.79, lon: 79.14, tz: 5.5, zone: "Asia/Kolkata", alt: "Tanjore" },
    { id: "kanchipuram", city: "Kāñcīpuram", region: "Tamil Nāḍu, India", lat: 12.84, lon: 79.7, tz: 5.5, zone: "Asia/Kolkata", alt: "Kanchi Conjeevaram" },
    { id: "chidambaram", city: "Cidambaram", region: "Tamil Nāḍu, India", lat: 11.4, lon: 79.69, tz: 5.5, zone: "Asia/Kolkata", alt: "Chidambaram Thillai" },
    { id: "palani", city: "Palani", region: "Tamil Nāḍu, India", lat: 10.45, lon: 77.52, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "tiruttani", city: "Tiruttaṇi", region: "Tamil Nāḍu, India", lat: 13.18, lon: 79.61, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "tiruchendur", city: "Tiruccendūr", region: "Tamil Nāḍu, India", lat: 8.5, lon: 78.12, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "rameswaram", city: "Rāmeśvaram", region: "Tamil Nāḍu, India", lat: 9.29, lon: 79.31, tz: 5.5, zone: "Asia/Kolkata", alt: "Rameshwaram Rameswaram" },
    { id: "kanyakumari", city: "Kanyākumārī", region: "Tamil Nāḍu, India", lat: 8.08, lon: 77.55, tz: 5.5, zone: "Asia/Kolkata", alt: "Kanyakumari Cape Comorin" },
    { id: "puducherry", city: "Puducherry", region: "Puducherry, India", lat: 11.94, lon: 79.83, tz: 5.5, zone: "Asia/Kolkata", alt: "Pondicherry Pondy" },
    { id: "thiruvananthapuram", city: "Thiruvananthapuram", region: "Kerala, India", lat: 8.52, lon: 76.94, tz: 5.5, zone: "Asia/Kolkata", alt: "Trivandrum Tvm" },
    { id: "kochi", city: "Kochi", region: "Kerala, India", lat: 9.93, lon: 76.27, tz: 5.5, zone: "Asia/Kolkata", alt: "Cochin Ernakulam" },
    { id: "thrissur", city: "Thrissūr", region: "Kerala, India", lat: 10.53, lon: 76.21, tz: 5.5, zone: "Asia/Kolkata", alt: "Trichur" },
    { id: "guruvayur", city: "Guruvāyūr", region: "Kerala, India", lat: 10.59, lon: 76.04, tz: 5.5, zone: "Asia/Kolkata", alt: "Guruvayoor" },
    { id: "kozhikode", city: "Kozhikode", region: "Kerala, India", lat: 11.25, lon: 75.78, tz: 5.5, zone: "Asia/Kolkata", alt: "Calicut" },
    { id: "kannur", city: "Kannūr", region: "Kerala, India", lat: 11.87, lon: 75.37, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "alappuzha", city: "Alappuzha", region: "Kerala, India", lat: 9.5, lon: 76.34, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "kollam", city: "Kollam", region: "Kerala, India", lat: 8.89, lon: 76.61, tz: 5.5, zone: "Asia/Kolkata" },
    { id: "sabarimala", city: "Śabarimala", region: "Kerala, India", lat: 9.44, lon: 77.08, elev: 914, tz: 5.5, zone: "Asia/Kolkata", alt: "Sabarimala Pamba" },
    { id: "newyork", city: "New York", region: "United States", lat: 40.71, lon: -74.01, tz: -5, zone: "America/New_York", top: 1, alt: "NYC New York City Manhattan Queens" },
    { id: "edison", city: "Edison, NJ", region: "United States", lat: 40.52, lon: -74.41, tz: -5, zone: "America/New_York", alt: "Edison New Jersey NJ" },
    { id: "boston", city: "Boston", region: "United States", lat: 42.36, lon: -71.06, tz: -5, zone: "America/New_York" },
    { id: "philadelphia", city: "Philadelphia", region: "United States", lat: 39.95, lon: -75.17, tz: -5, zone: "America/New_York" },
    { id: "washington", city: "Washington, DC", region: "United States", lat: 38.91, lon: -77.04, tz: -5, zone: "America/New_York", alt: "DC Washington Virginia Maryland" },
    { id: "atlanta", city: "Atlanta", region: "United States", lat: 33.75, lon: -84.39, tz: -5, zone: "America/New_York" },
    { id: "raleigh", city: "Raleigh", region: "United States", lat: 35.78, lon: -78.64, tz: -5, zone: "America/New_York" },
    { id: "charlotte", city: "Charlotte", region: "United States", lat: 35.23, lon: -80.84, tz: -5, zone: "America/New_York" },
    { id: "miami", city: "Miami", region: "United States", lat: 25.76, lon: -80.19, tz: -5, zone: "America/New_York" },
    { id: "detroit", city: "Detroit", region: "United States", lat: 42.33, lon: -83.05, tz: -5, zone: "America/Detroit" },
    { id: "columbus", city: "Columbus", region: "United States", lat: 39.96, lon: -83, tz: -5, zone: "America/New_York" },
    { id: "chicago", city: "Chicago", region: "United States", lat: 41.88, lon: -87.63, tz: -6, zone: "America/Chicago" },
    { id: "houston", city: "Houston", region: "United States", lat: 29.76, lon: -95.37, tz: -6, zone: "America/Chicago" },
    { id: "dallas", city: "Dallas", region: "United States", lat: 32.78, lon: -96.8, tz: -6, zone: "America/Chicago" },
    { id: "austin", city: "Austin", region: "United States", lat: 30.27, lon: -97.74, tz: -6, zone: "America/Chicago" },
    { id: "minneapolis", city: "Minneapolis", region: "United States", lat: 44.98, lon: -93.27, tz: -6, zone: "America/Chicago" },
    { id: "denver", city: "Denver", region: "United States", lat: 39.74, lon: -104.99, tz: -7, zone: "America/Denver" },
    { id: "phoenix", city: "Phoenix", region: "United States", lat: 33.45, lon: -112.07, tz: -7, zone: "America/Phoenix" },
    { id: "saltlake", city: "Salt Lake City", region: "United States", lat: 40.76, lon: -111.89, tz: -7, zone: "America/Denver" },
    { id: "seattle", city: "Seattle", region: "United States", lat: 47.61, lon: -122.33, tz: -8, zone: "America/Los_Angeles" },
    { id: "sanfrancisco", city: "San Francisco", region: "United States", lat: 37.77, lon: -122.42, tz: -8, zone: "America/Los_Angeles", alt: "SF Bay Area" },
    { id: "sanjose", city: "San Jose", region: "United States", lat: 37.34, lon: -121.89, tz: -8, zone: "America/Los_Angeles", alt: "San Jose Bay Area Silicon Valley" },
    { id: "losangeles", city: "Los Angeles", region: "United States", lat: 34.05, lon: -118.24, tz: -8, zone: "America/Los_Angeles", alt: "LA Los Angeles" },
    { id: "sandiego", city: "San Diego", region: "United States", lat: 32.72, lon: -117.16, tz: -8, zone: "America/Los_Angeles" },
    { id: "toronto", city: "Toronto", region: "Canada", lat: 43.65, lon: -79.38, tz: -5, zone: "America/Toronto", top: 1, alt: "Toronto GTA Scarborough" },
    { id: "mississauga", city: "Mississauga", region: "Canada", lat: 43.59, lon: -79.64, tz: -5, zone: "America/Toronto" },
    { id: "montreal", city: "Montréal", region: "Canada", lat: 45.5, lon: -73.57, tz: -5, zone: "America/Toronto", alt: "Montreal" },
    { id: "calgary", city: "Calgary", region: "Canada", lat: 51.05, lon: -114.07, tz: -7, zone: "America/Edmonton" },
    { id: "vancouver", city: "Vancouver", region: "Canada", lat: 49.28, lon: -123.12, tz: -8, zone: "America/Vancouver" },
    { id: "london", city: "London", region: "United Kingdom", lat: 51.51, lon: -0.13, tz: 0, zone: "Europe/London", top: 1 },
    { id: "leicester", city: "Leicester", region: "United Kingdom", lat: 52.64, lon: -1.13, tz: 0, zone: "Europe/London" },
    { id: "birminghamuk", city: "Birmingham", region: "United Kingdom", lat: 52.49, lon: -1.89, tz: 0, zone: "Europe/London", alt: "Birmingham UK" },
    { id: "manchester", city: "Manchester", region: "United Kingdom", lat: 53.48, lon: -2.24, tz: 0, zone: "Europe/London" },
    { id: "glasgow", city: "Glasgow", region: "United Kingdom", lat: 55.86, lon: -4.25, tz: 0, zone: "Europe/London" },
    { id: "dublin", city: "Dublin", region: "Ireland", lat: 53.35, lon: -6.26, tz: 0, zone: "Europe/Dublin" },
    { id: "paris", city: "Paris", region: "France", lat: 48.86, lon: 2.35, tz: 1, zone: "Europe/Paris" },
    { id: "amsterdam", city: "Amsterdam", region: "Netherlands", lat: 52.37, lon: 4.9, tz: 1, zone: "Europe/Amsterdam" },
    { id: "frankfurt", city: "Frankfurt", region: "Germany", lat: 50.11, lon: 8.68, tz: 1, zone: "Europe/Berlin" },
    { id: "munich", city: "München", region: "Germany", lat: 48.14, lon: 11.58, tz: 1, zone: "Europe/Berlin", alt: "Munich Muenchen" },
    { id: "zurich", city: "Zürich", region: "Switzerland", lat: 47.38, lon: 8.54, tz: 1, zone: "Europe/Zurich", alt: "Zurich Zuerich" },
    { id: "stockholm", city: "Stockholm", region: "Sweden", lat: 59.33, lon: 18.07, tz: 1, zone: "Europe/Stockholm" },
    { id: "oslo", city: "Oslo", region: "Norway", lat: 59.91, lon: 10.75, tz: 1, zone: "Europe/Oslo" },
    { id: "lisbon", city: "Lisboa", region: "Portugal", lat: 38.72, lon: -9.14, tz: 0, zone: "Europe/Lisbon", alt: "Lisbon Lisboa" },
    { id: "moscow", city: "Moscow", region: "Russia", lat: 55.76, lon: 37.62, tz: 3, zone: "Europe/Moscow" },
    { id: "dubai", city: "Dubai", region: "United Arab Emirates", lat: 25.2, lon: 55.27, tz: 4, zone: "Asia/Dubai", top: 1 },
    { id: "abudhabi", city: "Abu Dhabi", region: "United Arab Emirates", lat: 24.45, lon: 54.38, tz: 4, zone: "Asia/Dubai" },
    { id: "muscat", city: "Muscat", region: "Oman", lat: 23.59, lon: 58.41, tz: 4, zone: "Asia/Muscat" },
    { id: "doha", city: "Doha", region: "Qatar", lat: 25.29, lon: 51.53, tz: 3, zone: "Asia/Qatar" },
    { id: "riyadh", city: "Riyadh", region: "Saudi Arabia", lat: 24.71, lon: 46.68, tz: 3, zone: "Asia/Riyadh" },
    { id: "kuwait", city: "Kuwait City", region: "Kuwait", lat: 29.38, lon: 47.99, tz: 3, zone: "Asia/Kuwait" },
    { id: "kathmandu", city: "Kathmandu", region: "Nepal", lat: 27.72, lon: 85.32, tz: 5.75, zone: "Asia/Kathmandu" },
    { id: "colombo", city: "Colombo", region: "Sri Lanka", lat: 6.93, lon: 79.86, tz: 5.5, zone: "Asia/Colombo" },
    { id: "dhaka", city: "Dhaka", region: "Bangladesh", lat: 23.81, lon: 90.41, tz: 6, zone: "Asia/Dhaka" },
    { id: "bangkok", city: "Bangkok", region: "Thailand", lat: 13.76, lon: 100.5, tz: 7, zone: "Asia/Bangkok" },
    { id: "singapore", city: "Singapore", region: "Singapore", lat: 1.35, lon: 103.82, tz: 8, zone: "Asia/Singapore", top: 1 },
    { id: "kualalumpur", city: "Kuala Lumpur", region: "Malaysia", lat: 3.14, lon: 101.69, tz: 8, zone: "Asia/Kuala_Lumpur", alt: "KL Kuala Lumpur" },
    { id: "hongkong", city: "Hong Kong", region: "China", lat: 22.32, lon: 114.17, tz: 8, zone: "Asia/Hong_Kong" },
    { id: "tokyo", city: "Tokyo", region: "Japan", lat: 35.68, lon: 139.69, tz: 9, zone: "Asia/Tokyo" },
    { id: "sydney", city: "Sydney", region: "Australia", lat: -33.87, lon: 151.21, tz: 10, zone: "Australia/Sydney", top: 1 },
    { id: "melbourne", city: "Melbourne", region: "Australia", lat: -37.81, lon: 144.96, tz: 10, zone: "Australia/Melbourne" },
    { id: "brisbane", city: "Brisbane", region: "Australia", lat: -27.47, lon: 153.03, tz: 10, zone: "Australia/Brisbane" },
    { id: "perth", city: "Perth", region: "Australia", lat: -31.95, lon: 115.86, tz: 8, zone: "Australia/Perth" },
    { id: "adelaide", city: "Adelaide", region: "Australia", lat: -34.93, lon: 138.6, tz: 9.5, zone: "Australia/Adelaide" },
    { id: "auckland", city: "Auckland", region: "New Zealand", lat: -36.85, lon: 174.76, tz: 12, zone: "Pacific/Auckland" },
    { id: "suva", city: "Suva", region: "Fiji", lat: -18.14, lon: 178.44, tz: 12, zone: "Pacific/Fiji" },
    { id: "johannesburg", city: "Johannesburg", region: "South Africa", lat: -26.2, lon: 28.05, tz: 2, zone: "Africa/Johannesburg" },
    { id: "durban", city: "Durban", region: "South Africa", lat: -29.86, lon: 31.02, tz: 2, zone: "Africa/Johannesburg" },
    { id: "nairobi", city: "Nairobi", region: "Kenya", lat: -1.29, lon: 36.82, tz: 3, zone: "Africa/Nairobi" },
    { id: "portlouis", city: "Port Louis", region: "Mauritius", lat: -20.16, lon: 57.5, tz: 4, zone: "Indian/Mauritius", alt: "Port Louis Mauritius" },
    { id: "portofspain", city: "Port of Spain", region: "Trinidad & Tobago", lat: 10.65, lon: -61.52, tz: -4, zone: "America/Port_of_Spain" },
    { id: "georgetown", city: "Georgetown", region: "Guyana", lat: 6.8, lon: -58.16, tz: -4, zone: "America/Guyana" },
    { id: "paramaribo", city: "Paramaribo", region: "Suriname", lat: 5.85, lon: -55.2, tz: -3, zone: "America/Paramaribo" },
    { id: "manama", city: "Manama", region: "Bahrain", lat: 26.23, lon: 50.59, tz: 3, zone: "Asia/Bahrain" },
  ];

  /* the real UTC offset for a place on a given day (DST-aware) */
  function effTz(loc, date) {
    if (!loc) return 0;
    if (loc.detected) return typeof loc.tz === "number" ? loc.tz : 0;
    if (!loc.zone) return loc.tz || 0;
    try {
      const part = new Intl.DateTimeFormat("en-US", { timeZone: loc.zone, timeZoneName: "longOffset" })
        .formatToParts(date || new Date()).find(p => p.type === "timeZoneName");
      const m = part && /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(part.value);
      if (m) return (m[1] === "-" ? -1 : 1) * (Number(m[2]) + Number(m[3] || 0) / 60);
    } catch (e) {}
    return loc.tz || 0;
  }

  /* nearest known city to a coordinate — the offline fallback when
     reverse geocoding is unavailable, and a sanity check on detection */
  function nearest(lat, lon) {
    let best = null, bestD = Infinity;
    for (const l of locations) {
      const dLat = (l.lat - lat) * D2R;
      const dLon = (l.lon - lon) * D2R;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * D2R) * Math.cos(l.lat * D2R) * Math.sin(dLon / 2) ** 2;
      const d = 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
      if (d < bestD) { bestD = d; best = l; }
    }
    return best ? { city: best.city, region: best.region, km: Math.round(bestD), zone: best.zone } : null;
  }

  /* ---------- Vocabulary ---------- */
  const VARA = [
    { en: "Sunday",    iast: "Ravivāra",   deva: "रविवार",   tel: "ఆదివారం",  lord: "Sūrya" },
    { en: "Monday",    iast: "Somavāra",   deva: "सोमवार",   tel: "సోమవారం",  lord: "Candra" },
    { en: "Tuesday",   iast: "Maṅgalavāra",deva: "मंगलवार",  tel: "మంగళవారం", lord: "Maṅgala" },
    { en: "Wednesday", iast: "Budhavāra",  deva: "बुधवार",   tel: "బుధవారం",  lord: "Budha" },
    { en: "Thursday",  iast: "Guruvāra",   deva: "गुरुवार",  tel: "బృహస్పతివారం", alt: "Bṛhaspativāra", lord: "Bṛhaspati" },
    { en: "Friday",    iast: "Śukravāra",  deva: "शुक्रवार", tel: "శుక్రవారం", lord: "Śukra" },
    { en: "Saturday",  iast: "Śanivāra",   deva: "शनिवार",   tel: "శనివారం",  lord: "Śani" },
  ];

  const TITHI = [
    { iast: "Pratipadā",  deva: "प्रतिपदा", tel: "పాడ్యమి" }, { iast: "Dvitīyā",    deva: "द्वितीया", tel: "విదియ" },
    { iast: "Tṛtīyā",     deva: "तृतीया",   tel: "తదియ" },   { iast: "Caturthī",   deva: "चतुर्थी", tel: "చవితి" },
    { iast: "Pañcamī",    deva: "पञ्चमी",   tel: "పంచమి" },   { iast: "Ṣaṣṭhī",     deva: "षष्ठी",   tel: "షష్ఠి" },
    { iast: "Saptamī",    deva: "सप्तमी",   tel: "సప్తమి" },   { iast: "Aṣṭamī",     deva: "अष्टमी",  tel: "అష్టమి" },
    { iast: "Navamī",     deva: "नवमी",     tel: "నవమి" },     { iast: "Daśamī",     deva: "दशमी",    tel: "దశమి" },
    { iast: "Ekādaśī",    deva: "एकादशी",   tel: "ఏకాదశి" },   { iast: "Dvādaśī",    deva: "द्वादशी", tel: "ద్వాదశి" },
    { iast: "Trayodaśī",  deva: "त्रयोदशी", tel: "త్రయోదశి" }, { iast: "Caturdaśī",  deva: "चतुर्दशी", tel: "చతుర్దశి" },
  ];

  const NAKSHATRA = [
    { iast: "Aśvinī",            deva: "अश्विनी",       tel: "అశ్విని" },     { iast: "Bharaṇī",          deva: "भरणी",         tel: "భరణి" },
    { iast: "Kṛttikā",           deva: "कृत्तिका",      tel: "కృత్తిక" },     { iast: "Rohiṇī",           deva: "रोहिणी",        tel: "రోహిణి" },
    { iast: "Mṛgaśīrṣa",         deva: "मृगशिरा",       tel: "మృగశిర" },      { iast: "Ārdrā",            deva: "आर्द्रा",       tel: "ఆరుద్ర" },
    { iast: "Punarvasu",         deva: "पुनर्वसु",      tel: "పునర్వసు" },    { iast: "Puṣya",            deva: "पुष्य",         tel: "పుష్యమి" },
    { iast: "Āśleṣā",            deva: "आश्लेषा",       tel: "ఆశ్లేష" },      { iast: "Maghā",            deva: "मघा",          tel: "మఖ" },
    { iast: "Pūrva Phalgunī",    deva: "पूर्वाफाल्गुनी", tel: "పుబ్బ" },       { iast: "Uttara Phalgunī",  deva: "उत्तराफाल्गुनी", tel: "ఉత్తర" },
    { iast: "Hasta",             deva: "हस्त",          tel: "హస్త" },        { iast: "Citrā",            deva: "चित्रा",        tel: "చిత్త" },
    { iast: "Svātī",             deva: "स्वाती",        tel: "స్వాతి" },      { iast: "Viśākhā",          deva: "विशाखा",        tel: "విశాఖ" },
    { iast: "Anurādhā",          deva: "अनुराधा",       tel: "అనూరాధ" },      { iast: "Jyeṣṭhā",          deva: "ज्येष्ठा",      tel: "జ్యేష్ఠ" },
    { iast: "Mūla",              deva: "मूल",           tel: "మూల" },         { iast: "Pūrva Aṣāḍhā",     deva: "पूर्वाषाढा",    tel: "పూర్వాషాఢ" },
    { iast: "Uttara Aṣāḍhā",     deva: "उत्तराषाढा",    tel: "ఉత్తరాషాఢ" },   { iast: "Śravaṇa",          deva: "श्रवण",         tel: "శ్రవణం" },
    { iast: "Dhaniṣṭhā",         deva: "धनिष्ठा",       tel: "ధనిష్ఠ" },      { iast: "Śatabhiṣā",        deva: "शतभिषा",        tel: "శతభిషం" },
    { iast: "Pūrva Bhādrapada",  deva: "पूर्वाभाद्रपदा", tel: "పూర్వాభాద్ర" }, { iast: "Uttara Bhādrapada",deva: "उत्तराभाद्रपदा", tel: "ఉత్తరాభాద్ర" },
    { iast: "Revatī",            deva: "रेवती",         tel: "రేవతి" },
  ];

  const YOGA = ["Viṣkambha","Prīti","Āyuṣmān","Saubhāgya","Śobhana","Atigaṇḍa","Sukarmā","Dhṛti","Śūla","Gaṇḍa","Vṛddhi","Dhruva","Vyāghāta","Harṣaṇa","Vajra","Siddhi","Vyatīpāta","Varīyān","Parigha","Śiva","Siddha","Sādhya","Śubha","Śukla","Brahmā","Aindra","Vaidhṛti"];
  const KARANA = ["Bava","Bālava","Kaulava","Taitila","Garaja","Vaṇija","Viṣṭi","Śakuni","Catuṣpāda","Nāga","Kiṃstughna"];

  // Month names, Gregorian-keyed — MASA_LUNAR below rotates them into their
  // own order, and that is the list the engine actually names a month from.
  const MASA = [
    { iast: "Puṣya",       deva: "पौष", tel: "పుష్య" },      // Jan
    { iast: "Māgha",       deva: "माघ", tel: "మాఘ" },      // Feb
    { iast: "Phālguna",    deva: "फाल्गुन", tel: "ఫాల్గుణ" },  // Mar
    { iast: "Caitra",      deva: "चैत्र", tel: "చైత్ర" },    // Apr
    { iast: "Vaiśākha",    deva: "वैशाख", tel: "వైశాఖ" },    // May
    { iast: "Jyeṣṭha",     deva: "ज्येष्ठ", tel: "జ్యేష్ఠ" },  // Jun
    { iast: "Āṣāḍha",      deva: "आषाढ", tel: "ఆషాఢ" },     // Jul
    { iast: "Śrāvaṇa",     deva: "श्रावण", tel: "శ్రావణ" },   // Aug
    { iast: "Bhādrapada",  deva: "भाद्रपद", tel: "భాద్రపద" },  // Sep
    { iast: "Āśvayuja",      deva: "आश्विन", tel: "ఆశ్వయుజ" },   // Oct
    { iast: "Kārtika",     deva: "कार्तिक", tel: "కార్తీక" },  // Nov
    { iast: "Mārgaśīrṣa",  deva: "मार्गशीर्ष", tel: "మార్గశిర" },// Dec
  ];
  /* the lunar months in their own order, Caitra first — the Gregorian-keyed
     MASA table above starts at Pauṣa, so this is that list rotated */
  const MASA_LUNAR = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2].map((i) => MASA[i]);
  /* seasons in sidereal order from Mīna, looked up by name so the Gregorian
     RITU table above can stay exactly as it is */
  const RITU_SID = ["Vasanta", "Grīṣma", "Varṣā", "Śarad", "Hemanta", "Śiśira"];
  const RITU_BY = {};            // filled on first use — RITU is declared below
  const rituByName = (n) => {
    if (!RITU_BY.__ready) { RITU.forEach((r) => { RITU_BY[r.iast] = r; }); RITU_BY.__ready = 1; }
    return RITU_BY[n];
  };

  /* sidereal longitude of the sun → rāśi 0–11 (Meṣa … Mīna).
     The ephemeris owns this. A month's name, the adhika test and the ṛtu are
     all decided on which side of a saṅkrānti the sun stands, and a second
     solar series kept here would settle those knife-edge calls its own way —
     it read a tenth of a degree off, which at a saṅkrānti is a whole month. */
  function sunRashi(date, flavour) {
    const EPH = STUTI_EPHEM;
    const fl = flavour || ((typeof ayanSys === "function") ? ayanSys() : "lahiri");
    return EPH.sunRashiAt(EPH.toJD(date), fl);
  }

  /* the māsa to show, given the reckoning the reciter keeps */
  function masaOf(pa, system) {
    if (!pa) return null;
    return system === "purnimanta" ? (pa.masaPurnimanta || pa.masa) : pa.masa;
  }

  const RITU = [
    { iast: "Śiśira", deva: "शिशिर", tel: "శిశిర", en: "late winter" }, // Jan
    { iast: "Śiśira", deva: "शिशिर", tel: "శిశిర", en: "late winter" }, // Feb
    { iast: "Vasanta",deva: "वसन्त", tel: "వసంత", en: "spring" },      // Mar
    { iast: "Vasanta",deva: "वसन्त", tel: "వసంత", en: "spring" },      // Apr
    { iast: "Grīṣma", deva: "ग्रीष्म", tel: "గ్రీష్మ", en: "summer" },     // May
    { iast: "Grīṣma", deva: "ग्रीष्म", tel: "గ్రీష్మ", en: "summer" },     // Jun
    { iast: "Varṣā",  deva: "वर्षा", tel: "వర్ష", en: "monsoon" },      // Jul
    { iast: "Varṣā",  deva: "वर्षा", tel: "వర్ష", en: "monsoon" },      // Aug
    { iast: "Śarad",  deva: "शरद", tel: "శరద్", en: "autumn" },         // Sep
    { iast: "Śarad",  deva: "शरद", tel: "శరద్", en: "autumn" },         // Oct
    { iast: "Hemanta",deva: "हेमन्त", tel: "హేమంత", en: "early winter" },// Nov
    { iast: "Hemanta",deva: "हेमन्त", tel: "హేమంత", en: "early winter" },// Dec
  ];

  const devaDigits = ["०","१","२","३","४","५","६","७","८","९"];
  const toDeva = n => String(n).split("").map(d => devaDigits[+d] ?? d).join("");

  /* ---------- Julian Day at a given UT hour ---------- */
  function julianDay(y, m, d, hourUT) {
    const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
      Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
    return jdn + (hourUT - 12) / 24;
  }

  /* The mean-synodic moonPhase() that used to live here is gone. Every limb
     now comes from STUTI_EPHEM, and leaving a second, disagreeing answer in
     the public API is exactly the trap this work was meant to close — it read
     0.4967 where the ephemeris reads 0.4903, some four and a half hours of
     tithi. Callers wanting the phase should read pa.phase. */

  /* ---------- NOAA sunrise / sunset (minutes after local midnight) ---------- */
  function dayOfYear(y, m, d) {
    return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000);
  }
  function sunTimes(y, m, d, lat, lon, tz, horizon) {
    /* the ephemeris sun, when it is loaded: apparent longitude → declination
       → altitude, bisected onto the horizon. The NOAA fit below stays as a
       fallback so the engine still answers if the ephemeris is absent. */
    const EPH = STUTI_EPHEM;
    if (EPH && EPH.sunRiseSet) {
      const r = EPH.sunRiseSet(julianDay(y, m, d, -tz), lat, lon, horizon);
      return { sunrise: r.rise, sunset: r.set, polar: r.polar };
    }
    const N = dayOfYear(y, m, d);
    const g = TWO_PI / 365 * (N - 1 + 0.5);
    const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
      - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
      - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
      - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const latR = lat * D2R;
    const zenith = 90.833 * D2R;
    const cosH = (Math.cos(zenith) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));
    if (cosH > 1)  return { sunrise: null, sunset: null, polar: "polar night" };
    if (cosH < -1) return { sunrise: null, sunset: null, polar: "midnight sun" };
    const ha = Math.acos(cosH) * R2D;          // hour angle, degrees
    // clock minutes after local midnight (lon positive east, tz standard offset)
    const noon = 720 - 4 * lon - eqtime + tz * 60;
    return { sunrise: noon - 4 * ha, sunset: noon + 4 * ha, decl, polar: null };
  }

  const RAHU_SEGMENT = [7, 1, 6, 4, 5, 3, 2]; // 0-indexed eighth of daytime, by weekday Sun..Sat
  const DURMUHURTA = [[14], [9, 12], [4], [8], [9], [3, 9], [3]]; // muhūrta no. of 15, by weekday Sun..Sat

  function fmtTime(min) {
    if (min == null) return "—";
    let m = ((min % 1440) + 1440) % 1440;
    let h = Math.floor(m / 60), mm = Math.round(m % 60);
    if (mm === 60) { mm = 0; h = (h + 1) % 24; }
    const ap = h < 12 ? "am" : "pm";
    let h12 = h % 12; if (h12 === 0) h12 = 12;
    return `${h12}:${String(mm).padStart(2, "0")} ${ap}`;
  }
  function fmtDur(min) {
    if (min == null) return "—";
    const h = Math.floor(min / 60), m = Math.round(min % 60);
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }

  /* ---------- The five limbs (+ derived) for one civil day ---------- */
  function forDay(date, loc, opts) {
    /* drik or vākya, before a single angle is asked for. The ephemeris holds
       the scheme as state so that nothing between here and the Rsine table
       has to carry it as an argument. */
    if (STUTI_EPHEM && STUTI_EPHEM.setSystem) {
      STUTI_EPHEM.setSystem(typeof reckoning === "function" ? reckoning() : "drik");
    }
    const TZ = effTz(loc, date);
    const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    const instant = opts && opts.instant;
    // Julian Day reckoned either at local noon (a civil day's tithi) or at the
    // exact moment carried by `date` (the tithi prevailing right now — what a
    // saṅkalpa actually names).
    const jd = instant
      ? julianDay(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(),
          date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600)
      : julianDay(y, m, d, 12 - TZ); // local noon

    // vāra — exact
    const varaIdx = date.getDay();
    const vara = VARA[varaIdx];

    // sun timings first: the limbs of a civil day are the ones current at
    // ITS SUNRISE, which is the rule every printed pañcāṅga keeps
    /* `horizon`, not `elev`: what shifts sunrise is how far the observer
       stands above the ground they can see to, and a plateau city stands
       level with its own horizon. See dip() in the ephemeris. */
    const st = sunTimes(y, m, d, loc.lat, loc.lon, TZ, loc.horizon);

    /* ---------- the five limbs, from real longitudes ----------
       Sun and moon come from STUTI_EPHEM (Meeus ch. 25 and the abridged
       ELP of ch. 47). Everything below is arithmetic on those two angles;
       nothing here is a cyclic stand-in any more. */
    const EPH = STUTI_EPHEM;
    const jdRef = instant ? jd
      : (st.sunrise != null ? julianDay(y, m, d, st.sunrise / 60 - TZ) : jd);
    const ayanFlavour = (typeof ayanSys === "function") ? ayanSys() : "lahiri";
    const lb = EPH.limbs(jdRef, ayanFlavour);

    const phase = lb.phase;
    const tIndex = lb.tithi;                              // 0..29
    const waxing = tIndex < 15;
    const within = tIndex % 15;                           // 0..14
    const isFull = tIndex === 14;
    const isNew = tIndex === 29;
    let tithiName, tithiDeva, tithiTel, tithiNum;
    if (isFull)      { tithiName = "Pūrṇimā";   tithiDeva = "पूर्णिमा";   tithiTel = "పౌర్ణమి";   tithiNum = 15; }
    else if (isNew)  { tithiName = "Amāvāsyā";  tithiDeva = "अमावस्या";  tithiTel = "అమావాస్య";  tithiNum = 15; }
    else             { tithiName = TITHI[within].iast; tithiDeva = TITHI[within].deva; tithiTel = TITHI[within].tel; tithiNum = within + 1; }
    const paksha = waxing ? "Śukla" : "Kṛṣṇa";
    const pakshaDeva = waxing ? "शुक्ल" : "कृष्ण";
    const pakshaTel = waxing ? "శుక్ల" : "కృష్ణ";
    const illum = (1 - Math.cos(phase * TWO_PI)) / 2; // 0..1 illuminated fraction

    // nakṣatra · yoga · karaṇa — now genuinely computed
    const nakIdx = lb.nakshatra;
    const nak = NAKSHATRA[nakIdx];
    const yogaIdx = lb.yoga;
    const karIdx = lb.karana;

    /* māsa — the real lunar month, not the Gregorian stand-in.
       The new moon that opened this month is phase × synodic days back;
       the rāśi the sun held then names the month (Mīna → Caitra). If the
       following new moon finds the sun in the same rāśi, no saṅkrānti fell
       inside and the month is adhika. Pūrṇimānta names run one month ahead
       through the dark fortnight — the same day, a different name. */
    const nmJd = EPH.lastNewMoon(jdRef);
    const nmDate = EPH.toDate(nmJd);
    const r1 = sunRashi(nmDate, ayanFlavour);
    /* the NEXT new moon, found the same exact way — a mean-synodic guess is
       out by up to seven hours, and the adhika test is decided precisely on
       that knife-edge, when the sun sits close to a saṅkrānti */
    const r2 = sunRashi(EPH.toDate(EPH.lastNewMoon(nmJd + 31)), ayanFlavour);
    const masaIdx = (r1 + 1) % 12;
    const masaAdhika = r1 === r2;
    /* the mirror case: two saṅkrāntis inside one lunation, and a month name
       is skipped altogether — kṣaya. It falls a few times a century, always
       in the Kārtika–Māgha stretch when the sun runs fastest, and always in
       a year that also carries an adhika. The lunation keeps its own name;
       the swallowed one is named alongside it. */
    const masaKshaya = ((r2 - r1 + 12) % 12) === 2;
    const masaKshayaName = masaKshaya ? MASA_LUNAR[(masaIdx + 1) % 12] : null;
    const masa = MASA_LUNAR[masaIdx];
    const masaPurnimanta = MASA_LUNAR[(masaIdx + (tIndex >= 15 ? 1 : 0)) % 12];
    /* a ṛtu is two solar signs, beginning with Vasanta at Mīna */
    const ritu = rituByName(RITU_SID[Math.floor(((sunRashi(EPH.toDate(jdRef), ayanFlavour) + 1) % 12) / 2)]) || RITU[m - 1];

    /* Ayana — sidereal, as the tradition reckons it. Uttarāyaṇa begins at
       Makara Saṅkrānti in mid-January, not at the tropical solstice in
       December; the two differ by three weeks and the app was naming the
       wrong one through all of them. */
    const sidSun = lb.sun;
    const uttar = (sidSun >= 270 || sidSun < 90);
    const ayana = uttar
      ? { iast: "Uttarāyaṇa", deva: "उत्तरायण", tel: "ఉత్తరాయణం", en: "northward course" }
      : { iast: "Dakṣiṇāyana", deva: "दक्षिणायन", tel: "దక్షిణాయనం", en: "southward course" };

    // when the tithi actually turns — found by bisection on the elongation,
    // so a nineteen-hour tithi and a twenty-six-hour one are both right
    const jdMidnight = julianDay(y, m, d, -TZ);          // local 00:00
    const endJd = EPH.tithiEnd(jdRef);
    const tithiEndMin = endJd != null ? (endJd - jdMidnight) * 1440 : null;
    const tithiEndsTomorrow = tithiEndMin != null && tithiEndMin >= 1440;
    const asMin = (j) => (j == null ? null : (j - jdMidnight) * 1440);
    const nakEndMin = asMin(EPH.nakshatraEnd(jdRef, ayanFlavour));
    const yogaEndMin = asMin(EPH.yogaEnd(jdRef, ayanFlavour));
    const karanaEndMin = asMin(EPH.karanaEnd(jdRef));
    /* and where each limb began. Negative minutes mean it took hold before
       this midnight — the usual case, since a limb outlives a civil day. */
    const tithiStartMin = asMin(EPH.tithiStart(jdRef));
    const nakStartMin = asMin(EPH.nakshatraStart(jdRef, ayanFlavour));
    const yogaStartMin = asMin(EPH.yogaStart(jdRef, ayanFlavour));
    const karanaStartMin = asMin(EPH.karanaStart(jdRef));
    /* moonrise governs Saṅkaṣṭī and every nakta vrata, where the fast is
       broken on sighting the moon rather than at any clock hour */
    const moon = EPH.moonRiseSet(jdMidnight, loc.lat, loc.lon, TZ, loc.horizon);
    /* The moon rises about fifty minutes later each day, so roughly once a
       month a rise (or a set) slides across midnight and one civil date has
       none at all. That is the sky, not a gap in the ephemeris — so the next
       one is carried alongside, in minutes past THIS midnight, and the
       display can say which it is instead of printing a bare dash. */
    let moonriseNext = null, moonsetNext = null;
    if (moon.rise == null || moon.set == null) {
      const nxt = EPH.moonRiseSet(jdMidnight + 1, loc.lat, loc.lon, TZ, loc.horizon);
      if (moon.rise == null && nxt.rise != null) moonriseNext = nxt.rise + 1440;
      if (moon.set == null && nxt.set != null) moonsetNext = nxt.set + 1440;
    }

    let rahu = null, dayLen = null, durmuhurta = null;
    if (st.sunrise != null && st.sunset != null) {
      dayLen = st.sunset - st.sunrise;
      const seg = dayLen / 8, i = RAHU_SEGMENT[varaIdx];
      rahu = { start: st.sunrise + seg * i, end: st.sunrise + seg * (i + 1) };
      // durmuhūrta — inauspicious muhūrta(s) of the daytime (day split into 15),
      // by weekday Sun..Sat, 1-indexed. Some days carry two.
      const mseg = dayLen / 15;
      durmuhurta = DURMUHURTA[varaIdx].map(n => ({
        start: st.sunrise + mseg * (n - 1),
        end:   st.sunrise + mseg * n,
      }));
    }

    // derived observances (from tithi)
    const observances = [];
    if (tIndex === 10)      observances.push({ id: "ekadashi-s", name: "Ekādaśī", deva: "एकादशी", kind: "vrata", note: "Śukla Ekādaśī — a fasting day sacred to Viṣṇu." });
    else if (tIndex === 25) observances.push({ id: "ekadashi-k", name: "Ekādaśī", deva: "एकादशी", kind: "vrata", note: "Kṛṣṇa Ekādaśī — a fasting day sacred to Viṣṇu." });
    if (isFull)             observances.push({ id: "purnima", name: "Pūrṇimā", deva: "पूर्णिमा", kind: "observance", note: "Full moon — auspicious for worship and charity." });
    if (isNew)              observances.push({ id: "amavasya", name: "Amāvāsyā", deva: "अमावस्या", kind: "observance", note: "New moon — a day for remembrance of ancestors (pitṛ)." });
    if (tIndex === 18)      observances.push({ id: "sankashti", name: "Saṅkaṣṭī Caturthī", deva: "सङ्कष्टी", kind: "vrata", note: "Kṛṣṇa Caturthī — fasting to Gaṇeśa, broken at moonrise." });
    if (tIndex === 3)       observances.push({ id: "vinayaka", name: "Vināyaka Caturthī", deva: "विनायक", kind: "observance", note: "Śukla Caturthī — sacred to Gaṇeśa." });

    /* the lunar year the day belongs to — its sixty-cycle name and the śaka
       era, both counted from the Caitra new moon rather than a fixed date */
    const ly = EPH.lunarYearOf(jdRef, ayanFlavour);

    return {
      date, loc,
      varaIdx, vara,
      phase, illum, waxing,
      tithiIndex: tIndex, tithiNum, tithiName, tithiDeva, tithiTel, paksha, pakshaDeva, pakshaTel,
      nakIdx, nak,
      yoga: YOGA[yogaIdx], karana: KARANA[karIdx],
      masa, masaPurnimanta, masaAdhika, masaKshaya, masaKshayaName, masaIdx, ritu,
      samvatsaraIdx: ly.samvatsara, shaka: ly.shaka, vikrama: ly.vikrama,
      reckoning: EPH.getSystem ? EPH.getSystem() : "drik",
      ayana, tithiEndMin, tithiEndsTomorrow, nakEndMin, yogaEndMin, karanaEndMin, jdRef,
      tithiStartMin, nakStartMin, yogaStartMin, karanaStartMin,
      moonrise: moon.rise, moonset: moon.set, moonriseNext, moonsetNext,
      /* pūrṇimā closes the bright fortnight and amāvāsyā the dark one, so
         naming the pakṣa alongside them only repeats what the name says */
      soloTithi: isFull || isNew,
      sunrise: st.sunrise, sunset: st.sunset, polar: st.polar, dayLen, rahu, durmuhurta,
      observances,
    };
  }

  /* ---------- The twelve solar signs, and the sun's own festivals ----------
     Every other observance in this app is lunar — a tithi inside a named
     month. A saṅkrānti is neither: it is the instant the sun crosses from one
     rāśi into the next, and no tithi rule can find it. The ephemeris has known
     these instants since it landed; nothing asked for them until now. */
  const RASHI = [
    { iast: "Meṣa",     deva: "मेष",     tel: "మేషం" },      { iast: "Vṛṣabha", deva: "वृषभ",  tel: "వృషభం" },
    { iast: "Mithuna",  deva: "मिथुन",  tel: "మిథునం" },    { iast: "Karka",   deva: "कर्क",   tel: "కర్కాటకం" },
    { iast: "Siṁha",    deva: "सिंह",    tel: "సింహం" },     { iast: "Kanyā",   deva: "कन्या",  tel: "కన్య" },
    { iast: "Tulā",     deva: "तुला",    tel: "తుల" },       { iast: "Vṛścika", deva: "वृश्चिक", tel: "వృశ్చికం" },
    { iast: "Dhanu",    deva: "धनु",     tel: "ధనుస్" },     { iast: "Makara",  deva: "मकर",   tel: "మకరం" },
    { iast: "Kumbha",   deva: "कुम्भ",   tel: "కుంభం" },     { iast: "Mīna",    deva: "मीन",   tel: "మీనం" },
  ];

  /* the twelve transits of a Gregorian year, in order, cached — they shift by
     a few hours a year and by nothing else, which is why a saṅkrānti holds to
     its date while every lunar festival wanders a month either way */
  const sankrantiCache = {};
  function sankrantis(year) {
    const EPH = STUTI_EPHEM;
    if (!EPH) return [];
    if (EPH.setSystem) EPH.setSystem(typeof reckoning === "function" ? reckoning() : "drik");
    const fl = (typeof ayanSys === "function") ? ayanSys() : "lahiri";
    const key = year + "|" + fl + "|" + (EPH.getSystem ? EPH.getSystem() : "drik");
    if (sankrantiCache[key]) return sankrantiCache[key];
    const out = [];
    let jd = EPH.toJD(new Date(Date.UTC(year, 0, 1)));
    for (let i = 0; i < 13; i++) {
      const t = EPH.sankrantiAfter(jd, fl);
      if (t == null) break;
      const civil = civilDay(t);
      if (civil.getFullYear() !== year) break;
      out.push({ rashi: EPH.sunRashiAt(t + 0.01, fl), jd: t, day: civil });
      jd = t + 1;
    }
    return (sankrantiCache[key] = out);
  }

  /* the reference location's own civil date for an instant — read off the
     UTC fields after shifting by the zone, so the answer does not depend on
     where the reader's device happens to be sitting */
  function civilDay(jd) {
    const EPH = STUTI_EPHEM;
    const tz = effTz(REF_LOC, EPH.toDate(jd));
    const s = EPH.toDate(jd + tz / 24);
    return new Date(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
  }

  /* The day a transit is kept on. A saṅkrānti is an instant, and what makes
     the day is the puṇyakāla around it — the bathing and giving hour. The rule
     printed almanacs follow, and the one kept here, is the plain one: the
     transit's own day, unless it falls after sunset, when the observance moves
     to the next morning. That is why Makara Saṅkrānti is sometimes the
     fourteenth of January and sometimes the fifteenth. */
  function sankrantiDay(year, rashi) {
    const s = sankrantis(year).find((x) => x.rashi === rashi);
    return s ? keptDay(s.jd) : null;
  }
  function keptDay(jd) {
    const d = civilDay(jd), pa = forDay(d, REF_LOC);
    if (pa.sunset != null) {
      const tz = effTz(REF_LOC, d);
      const setJd = julianDay(d.getFullYear(), d.getMonth() + 1, d.getDate(), pa.sunset / 60 - tz);
      if (jd > setJd) return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    }
    return d;
  }

  /* ---------- the solar month, and the day inside it ----------
     A saura saṅkalpa does not name the lunar māsa at all: it names the rāśi
     the sun stands in and the day counted from the saṅkrānti that opened it —
     Cittirai 1, Āḍi 17. Tamil Nāḍu, Kerala, Bengal, Assam and Odisha reckon
     this way; the same day, named from the sun instead of the moon. */
  function solarDate(date) {
    const EPH = STUTI_EPHEM;
    if (!EPH) return null;
    const y = date.getFullYear();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    /* the month a civil day belongs to is decided by the kept day, not by the
       transit instant — comparing against the instant put the fourteenth of
       April, which IS Meṣa 1, at the end of Mīna */
    let last = null;
    sankrantis(y - 1).concat(sankrantis(y)).forEach((s) => {
      const k = keptDay(s.jd);
      if (k <= today && (!last || k > last.first)) last = { rashi: s.rashi, jd: s.jd, first: k };
    });
    if (!last) return null;
    return { rashi: last.rashi, masa: RASHI[last.rashi],
             day: Math.round((today - last.first) / 86400000) + 1, jd: last.jd, first: last.first };
  }

  /* ---------- Resolve a festival's Gregorian date from its lunar coordinates ----------
     Finds the day (nearest the middle of the target Gregorian month) whose
     computed tithi matches `tithiIndex`, so the festival always lands on a day
     the engine itself agrees is that tithi. Reckoned at a fixed reference
     location so festival dates don't shift per viewer. ---------------------------- */
  /* Ujjain by name, not by position — the list above is ordered for the
     location picker, and its first entry is New Delhi. Read as locations[0]
     this silently reckoned every festival at Delhi while the comment said
     Ujjain, which is a day's difference whenever a tithi ends near dawn. */
  const REF_LOC = locations.find((l) => l.id === "ujjain") || locations[0];
  /* ---------- finding the day a tithi falls on ----------
     The old version scanned ±16 days from the 15th of a Gregorian month and
     tested for an exact index match — which anchors a lunar event to a solar
     month, and returns nothing at all when the tithi is elided, falling back
     to the 15th as though that were an answer. This one asks the ephemeris
     when the elongation actually reaches the boundary, then returns the day
     at whose sunrise the tithi is current — the rule a printed pañcāṅga
     keeps. An elided tithi resolves to the day it fell inside. */
  function nextTithiFrom(fromDate, tithiIndex, refLoc) {
    const loc = refLoc || REF_LOC;
    const EPH = STUTI_EPHEM;
    if (!EPH) return null;
    /* a festival is resolved in the reciter's own scheme too — vākya moves
       some of them by a day, which is the whole reason the choice exists */
    if (EPH.setSystem) EPH.setSystem(typeof reckoning === "function" ? reckoning() : "drik");
    const target = tithiIndex * 12;
    let jd = EPH.toJD(fromDate);
    /* step to just before the boundary, then bisect onto it */
    for (let i = 0; i < 40; i++) {
      const e = EPH.elong(jd);
      let ahead = target - e;
      if (ahead <= 0) ahead += 360;
      if (ahead < 13) {                       // within about a day of it
        const hit = EPH.crossing(EPH.elong, target, jd - 0.05, jd + 1.4);
        if (hit != null) return dayOfSunrise(hit, loc);
      }
      jd += Math.max(0.5, (ahead - 12) / 12.19);
    }
    return null;
  }

  /* the civil day at whose sunrise the moment `jd` falls within the tithi */
  function dayOfSunrise(jd, loc) {
    const EPH = STUTI_EPHEM;
    const start = EPH.tithiStart(jd + 1 / 1440), end = EPH.tithiEnd(jd + 1 / 1440);
    const guess = EPH.toDate(jd);
    for (const off of [0, 1, -1]) {
      const d = new Date(guess.getFullYear(), guess.getMonth(), guess.getDate() + off);
      const pa = forDay(d, loc);
      if (pa.sunrise == null || pa.jdRef == null) continue;
      if (start != null && end != null && pa.jdRef >= start && pa.jdRef <= end) return d;
    }
    /* elided: no sunrise falls inside it, so the day it began on */
    const s = EPH.toDate(start != null ? start : jd);
    return new Date(s.getFullYear(), s.getMonth(), s.getDate());
  }

  /* kept for callers that want "the one nearest the middle of this Gregorian
     month" — now exact underneath, and honest when there is no such day */
  function findTithiDate(year, monthIndex0, tithiIndex, refLoc) {
    const loc = refLoc || REF_LOC;
    const d = nextTithiFrom(new Date(year, monthIndex0, 1), tithiIndex, loc);
    if (d && d.getMonth() === monthIndex0 && d.getFullYear() === year) return d;
    return d || null;
  }

  return {
    locations, VARA, TITHI, NAKSHATRA, MASA, MASA_LUNAR, RITU, RASHI, nearest, effTz, sunRashi, masaOf,
    forDay, sunTimes, findTithiDate, nextTithiFrom, dayOfSunrise, sankrantis, sankrantiDay, solarDate, fmtTime, fmtDur, toDeva,
  };
})();
