import type {
  Caregiver,
  DashboardAppointment,
  DashboardStats,
} from "@/features/dashboard/types";
import type {
  DashboardAppointmentsData,
  DashboardHomeData,
  DashboardRecommendedData,
} from "@/features/dashboard/services/dashboard-service";
import { assets } from "@/lib/assets";

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  appointments: { count: 0, detail: "No upcoming visits" },
  pendingRequests: { count: 0, detail: "" },
  unreadMessages: { count: 0, detail: "" },
};

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function mapHomeStats(data: DashboardHomeData): DashboardStats | null {
  const stats = data.stats;
  if (!stats) return null;
  return {
    appointments: {
      count: stats.careAppointments ?? 0,
      detail: str(stats.nextAppointmentLabel, "No upcoming visits"),
    },
    pendingRequests: {
      count: stats.pendingRequests ?? 0,
      detail: str(stats.pendingDetail, ""),
    },
    unreadMessages: {
      count: stats.unreadMessages ?? 0,
      detail: str(stats.messagesDetail, ""),
    },
  };
}

export function mapAppointments(
  data: DashboardAppointmentsData,
): DashboardAppointment[] {
  const days = data.days ?? [];
  const result: DashboardAppointment[] = [];
  for (const day of days) {
    const dateStr = str(day.date, "");
    const dayOfMonth = dateStr
      ? new Date(dateStr).getDate()
      : Number(day.label?.replace(/\D/g, "")) || 0;
    const appointments = day.appointments ?? [];
    for (const apt of appointments) {
      result.push({
        id: str(apt.id, `apt-${result.length}`),
        title: str(apt.title ?? apt.type, "Care visit"),
        dateLabel: str(apt.dateLabel ?? day.label, dateStr),
        timeLabel: str(apt.timeLabel ?? apt.time, ""),
        caregiverName: str(apt.caregiverName ?? apt.caregiver, "Caregiver"),
        caregiverAvatarUrl: str(
          apt.caregiverAvatarUrl ?? apt.avatarUrl,
          assets.defaultAvatar,
        ),
        dayOfMonth: Number(apt.dayOfMonth) || dayOfMonth,
      });
    }
  }
  return result;
}

export function mapWeekDays(data: DashboardAppointmentsData) {
  const days = data.days ?? [];
  if (!days.length) return null;
  return days.map((day) => {
    const dateStr = str(day.date, "");
    const d = dateStr ? new Date(dateStr) : null;
    const label = d
      ? d.toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 2)
      : str(day.label, "—").slice(0, 2);
    const dayNum = d
      ? d.getDate()
      : Number(day.label?.replace(/\D/g, "")) || 0;
    return { label, day: dayNum } as const;
  });
}

export function mapRecommendedCaregivers(
  data: DashboardRecommendedData,
  recipientId: string,
): Caregiver[] {
  const list = data.recommendations ?? [];
  return list
    .map((rec, index): Caregiver | null => {
      const id = str(rec.id ?? rec.caregiverId, `rec-${index}`);
      const name = str(rec.name ?? rec.fullName, "Caregiver");
      const category = (str(rec.category, "non_clinical") ||
        "non_clinical") as Caregiver["category"];
      return {
        id,
        name,
        verified: Boolean(rec.verified ?? true),
        category,
        categoryLabel: str(
          rec.categoryLabel,
          category === "clinical"
            ? "Clinical care"
            : category === "personal_specialized"
              ? "Personal & specialized care"
              : "Non-clinical care",
        ),
        rating: Number(rec.rating) || 4.5,
        area: str(rec.area ?? rec.lga, ""),
        city: str(rec.city ?? rec.state, "Lagos"),
        priceLabel: str(rec.priceLabel, "From ₦15,000/day"),
        priceAmount: Number(rec.priceAmount) || 15000,
        arrangement: rec.arrangement as Caregiver["arrangement"],
        gender: (str(rec.gender, "female") === "male" ? "male" : "female") as
          | "female"
          | "male",
        languages: Array.isArray(rec.languages)
          ? (rec.languages as string[])
          : ["English"],
        imageUrl: str(rec.imageUrl ?? rec.photoUrl, assets.defaultAvatar),
        saved: Boolean(rec.saved),
        recipientIds: [recipientId],
      };
    })
    .filter((item): item is Caregiver => item !== null);
}
