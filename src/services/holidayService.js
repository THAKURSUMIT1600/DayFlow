// Holiday awareness and long weekend detection service for Indian holidays
// Note: Some dates are approximate as they vary based on lunar calendar

// Simple date utilities to avoid external dependencies
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

const format = (date, formatStr) => {
  if (formatStr === "yyyy-MM-dd") {
    return date.toISOString().split("T")[0];
  }
  return date.toISOString();
};

const parseISO = (dateString) => {
  return new Date(dateString);
};

// Indian National and Public Holidays 2024-2026
const INDIAN_HOLIDAYS = {
  2024: [
    { name: "New Year's Day", date: "2024-01-01", type: "national" },
    { name: "Makar Sankranti", date: "2024-01-15", type: "festival" },
    { name: "Republic Day", date: "2024-01-26", type: "national" },
    { name: "Maha Shivratri", date: "2024-03-08", type: "festival" },
    { name: "Holi", date: "2024-03-25", type: "festival" },
    { name: "Good Friday", date: "2024-03-29", type: "religious" },
    { name: "Ram Navami", date: "2024-04-17", type: "festival" },
    { name: "Hanuman Jayanti", date: "2024-04-23", type: "festival" },
    { name: "Buddha Purnima", date: "2024-05-23", type: "festival" },
    { name: "Eid al-Fitr", date: "2024-04-11", type: "religious" },
    { name: "Independence Day", date: "2024-08-15", type: "national" },
    { name: "Janmashtami", date: "2024-08-26", type: "festival" },
    { name: "Ganesh Chaturthi", date: "2024-09-07", type: "festival" },
    { name: "Gandhi Jayanti", date: "2024-10-02", type: "national" },
    { name: "Dussehra", date: "2024-10-12", type: "festival" },
    { name: "Diwali", date: "2024-11-01", type: "festival" },
    { name: "Guru Nanak Jayanti", date: "2024-11-15", type: "religious" },
    { name: "Christmas Day", date: "2024-12-25", type: "religious" },
  ],
  2025: [
    { name: "New Year's Day", date: "2025-01-01", type: "national" },
    { name: "Makar Sankranti", date: "2025-01-14", type: "festival" },
    { name: "Republic Day", date: "2025-01-26", type: "national" },
    { name: "Maha Shivratri", date: "2025-02-26", type: "festival" },
    { name: "Holi", date: "2025-03-14", type: "festival" },
    { name: "Good Friday", date: "2025-04-18", type: "religious" },
    { name: "Ram Navami", date: "2025-04-06", type: "festival" },
    { name: "Hanuman Jayanti", date: "2025-04-13", type: "festival" },
    { name: "Buddha Purnima", date: "2025-05-12", type: "festival" },
    { name: "Eid al-Fitr", date: "2025-03-31", type: "religious" },
    { name: "Independence Day", date: "2025-08-15", type: "national" },
    { name: "Janmashtami", date: "2025-08-16", type: "festival" },
    { name: "Ganesh Chaturthi", date: "2025-08-27", type: "festival" },
    { name: "Gandhi Jayanti", date: "2025-10-02", type: "national" },
    { name: "Dussehra", date: "2025-10-02", type: "festival" },
    { name: "Diwali", date: "2025-10-20", type: "festival" },
    { name: "Guru Nanak Jayanti", date: "2025-11-05", type: "religious" },
    { name: "Christmas Day", date: "2025-12-25", type: "religious" },
  ],
  2026: [
    { name: "New Year's Day", date: "2026-01-01", type: "national" },
    { name: "Makar Sankranti", date: "2026-01-14", type: "festival" },
    { name: "Republic Day", date: "2026-01-26", type: "national" },
    { name: "Maha Shivratri", date: "2026-02-17", type: "festival" },
    { name: "Holi", date: "2026-03-03", type: "festival" },
    { name: "Good Friday", date: "2026-04-03", type: "religious" },
    { name: "Ram Navami", date: "2026-03-25", type: "festival" },
    { name: "Hanuman Jayanti", date: "2026-04-01", type: "festival" },
    { name: "Buddha Purnima", date: "2026-05-01", type: "festival" },
    { name: "Eid al-Fitr", date: "2026-03-20", type: "religious" },
    { name: "Independence Day", date: "2026-08-15", type: "national" },
    { name: "Janmashtami", date: "2026-09-04", type: "festival" },
    { name: "Ganesh Chaturthi", date: "2026-08-16", type: "festival" },
    { name: "Gandhi Jayanti", date: "2026-10-02", type: "national" },
    { name: "Dussehra", date: "2026-10-21", type: "festival" },
    { name: "Diwali", date: "2026-11-08", type: "festival" },
    { name: "Guru Nanak Jayanti", date: "2026-11-24", type: "religious" },
    { name: "Christmas Day", date: "2026-12-25", type: "religious" },
  ],
};

class HolidayService {
  constructor() {
    this.holidays = INDIAN_HOLIDAYS;
  }

  /**
   * Get all holidays for a specific year
   */
  getHolidaysForYear(year) {
    return this.holidays[year] || [];
  }

  /**
   * Check if a date is a holiday
   */
  isHoliday(date) {
    const year = date.getFullYear();
    const holidays = this.getHolidaysForYear(year);
    const dateString = format(date, "yyyy-MM-dd");

    return holidays.some((holiday) => holiday.date === dateString);
  }

  /**
   * Get holiday info for a specific date
   */
  getHolidayInfo(date) {
    const year = date.getFullYear();
    const holidays = this.getHolidaysForYear(year);
    const dateString = format(date, "yyyy-MM-dd");

    return holidays.find((holiday) => holiday.date === dateString);
  }

  /**
   * Detect long weekends (3+ consecutive days off)
   */
  detectLongWeekends(startDate = new Date(), daysAhead = 90) {
    const longWeekends = [];
    const endDate = addDays(startDate, daysAhead);

    for (let year of [startDate.getFullYear(), endDate.getFullYear()]) {
      const holidays = this.getHolidaysForYear(year);

      holidays.forEach((holiday) => {
        const holidayDate = parseISO(holiday.date);

        if (holidayDate >= startDate && holidayDate <= endDate) {
          const longWeekend = this.calculateLongWeekend(holidayDate);
          if (longWeekend.duration >= 3) {
            longWeekends.push({
              ...longWeekend,
              triggerHoliday: holiday,
            });
          }
        }
      });
    }

    // Remove duplicates and sort by start date
    const uniqueLongWeekends = this.removeDuplicateLongWeekends(longWeekends);
    return uniqueLongWeekends.sort((a, b) => a.startDate - b.startDate);
  }

  /**
   * Calculate the extent of a long weekend around a holiday
   */
  calculateLongWeekend(holidayDate) {
    let startDate = new Date(holidayDate);
    let endDate = new Date(holidayDate);

    // Extend backwards to include weekend days and adjacent holidays
    while (this.isDayOff(addDays(startDate, -1))) {
      startDate = addDays(startDate, -1);
    }

    // Extend forwards to include weekend days and adjacent holidays
    while (this.isDayOff(addDays(endDate, 1))) {
      endDate = addDays(endDate, 1);
    }

    const duration =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    return {
      startDate,
      endDate,
      duration,
      type: this.categorizeLongWeekend(duration),
    };
  }

  /**
   * Check if a day is off (weekend or holiday)
   */
  isDayOff(date) {
    return isWeekend(date) || this.isHoliday(date);
  }

  /**
   * Categorize long weekend by duration
   */
  categorizeLongWeekend(duration) {
    if (duration >= 4) return "extended";
    if (duration === 3) return "long";
    return "regular";
  }

  /**
   * Remove duplicate long weekends
   */
  removeDuplicateLongWeekends(longWeekends) {
    const seen = new Set();
    return longWeekends.filter((weekend) => {
      const key = `${format(weekend.startDate, "yyyy-MM-dd")}_${format(
        weekend.endDate,
        "yyyy-MM-dd"
      )}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Get upcoming long weekends with suggestions
   */
  getUpcomingLongWeekendsWithSuggestions(limit = 3) {
    const longWeekends = this.detectLongWeekends();

    return longWeekends.slice(0, limit).map((weekend) => ({
      ...weekend,
      suggestions: this.generateLongWeekendSuggestions(weekend),
      daysUntil: Math.ceil(
        (weekend.startDate - new Date()) / (1000 * 60 * 60 * 24)
      ),
    }));
  }

  /**
   * Generate activity suggestions for long weekends
   */
  generateLongWeekendSuggestions(weekend) {
    const suggestions = [];

    if (weekend.duration >= 4) {
      suggestions.push(
        "Perfect time for a short vacation to hill stations or beaches",
        "Consider visiting heritage sites or exploring nearby states",
        "Plan a spiritual journey to temples or ashrams",
        "Organize a family reunion or wedding celebrations"
      );
    } else if (weekend.duration === 3) {
      suggestions.push(
        "Great for a weekend getaway to nearby cities",
        "Try adventure activities like trekking or river rafting",
        "Plan festival celebrations with family and friends",
        "Explore local cuisine and street food tours"
      );
    }

    // Festival-specific suggestions
    if (weekend.triggerHoliday) {
      const holidayName = weekend.triggerHoliday.name.toLowerCase();

      if (holidayName.includes("diwali")) {
        suggestions.push(
          "Perfect time for home decoration and rangoli making",
          "Plan family gatherings and sweet exchanges",
          "Visit temples and attend cultural programs"
        );
      } else if (holidayName.includes("holi")) {
        suggestions.push(
          "Organize color celebrations with friends and family",
          "Prepare traditional sweets like gujiya and thandai",
          "Visit parks for Holi celebrations"
        );
      } else if (holidayName.includes("ganesh")) {
        suggestions.push(
          "Participate in Ganesh pandal visits",
          "Learn traditional arts and crafts",
          "Enjoy modak making and cultural performances"
        );
      } else if (
        holidayName.includes("independence") ||
        holidayName.includes("republic")
      ) {
        suggestions.push(
          "Attend flag hoisting ceremonies",
          "Visit historical monuments and museums",
          "Organize patriotic movie marathons"
        );
      }
    }

    // Seasonal suggestions based on Indian climate
    const month = weekend.startDate.getMonth();
    if (month >= 2 && month <= 5) {
      // March-June (Summer)
      suggestions.push(
        "Plan early morning or evening outdoor activities",
        "Visit hill stations to escape the heat",
        "Enjoy seasonal fruits like mangoes and watermelons"
      );
    } else if (month >= 6 && month <= 9) {
      // July-October (Monsoon/Post-monsoon)
      suggestions.push(
        "Perfect weather for trekking in Western Ghats",
        "Enjoy hot pakoras and chai during rains",
        "Visit waterfalls and green landscapes"
      );
    } else if (month >= 10 && month <= 1) {
      // November-February (Winter)
      suggestions.push(
        "Ideal weather for outdoor festivals and events",
        "Plan picnics in gardens and parks",
        "Enjoy traditional winter foods and warm gatherings"
      );
    }

    return suggestions;
  }

  /**
   * Get next holiday
   */
  getNextHoliday() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    const holidays = [
      ...this.getHolidaysForYear(currentYear),
      ...this.getHolidaysForYear(nextYear),
    ];

    const upcomingHolidays = holidays
      .map((holiday) => ({
        ...holiday,
        date: parseISO(holiday.date),
      }))
      .filter((holiday) => holiday.date > today)
      .sort((a, b) => a.date - b.date);

    return upcomingHolidays[0] || null;
  }
}

// Create and export singleton instance
export const holidayService = new HolidayService();
export default holidayService;
