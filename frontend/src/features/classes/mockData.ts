import { ClassItem } from "@/types";

export const MOCK_CLASSES: ClassItem[] = [
  {
    id: "1",
    name: "Class 9A",
    subject: "Mathematics",
    schedule: ["Mon", "Wed", "Fri"],
    studentCount: 24,
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1632516643720-e7f5d72605d5?q=80&w=400&auto=format&fit=crop", // math aesthetic
  },
  {
    id: "2",
    name: "Class 10B",
    subject: "Physics",
    schedule: ["Tue", "Thu"],
    studentCount: 1,
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400&auto=format&fit=crop", // lab/science aesthetic
  },
  {
    id: "3",
    name: "Class 8C",
    subject: "History",
    schedule: ["Mon", "Fri"],
    studentCount: 21,
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400&auto=format&fit=crop", // books aesthetic
  },
  {
    id: "4",
    name: "Class 11A",
    subject: "Biology",
    schedule: ["Mon", "Tue", "Thu"],
    studentCount: 15,
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1530213786676-412f7169f403?q=80&w=400&auto=format&fit=crop", // microscope aesthetic
  },
  {
    id: "5",
    name: "Class 9C",
    subject: "Literature",
    schedule: ["Wed", "Fri"],
    studentCount: 28,
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1474932430478-367d16b99031?q=80&w=400&auto=format&fit=crop", // writing/books
  },
  {
    id: "6",
    name: "Class 12A",
    subject: "Organic Chemistry",
    schedule: ["Wed", "Fri"],
    studentCount: 30,
    isActive: false,
    imageUrl:
      "https://images.unsplash.com/photo-1532187643603-a12fb94709d4?q=80&w=400&auto=format&fit=crop", // beakers
  },
];
