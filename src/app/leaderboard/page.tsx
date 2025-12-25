"use client"

import { useState } from "react";
import Layout from "@/components/Layout";
import { Search, ChevronRight, Github, Award, Code2, Users } from "lucide-react";

interface Student {
  id: number;
  name: string;
  rank: number;
  problemsSolved: number;
  skillLevel: string;
  university: string;
  department: string;
  year: string;
  github: string;
  projects: number;
  connections: number;
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    rank: 1,
    problemsSolved: 250,
    skillLevel: "Expert",
    university: "MIT",
    department: "Computer Science",
    year: "3rd Year",
    github: "github.com/alice",
    projects: 12,
    connections: 45,
  },
  {
    id: 2,
    name: "Bob Smith",
    rank: 2,
    problemsSolved: 235,
    skillLevel: "Advanced",
    university: "Stanford",
    department: "Computer Science",
    year: "4th Year",
    github: "github.com/bob",
    projects: 10,
    connections: 38,
  },
  {
    id: 3,
    name: "Carol Williams",
    rank: 3,
    problemsSolved: 220,
    skillLevel: "Advanced",
    university: "CMU",
    department: "Software Engineering",
    year: "3rd Year",
    github: "github.com/carol",
    projects: 8,
    connections: 32,
  },
  {
    id: 4,
    name: "David Brown",
    rank: 4,
    problemsSolved: 195,
    skillLevel: "Intermediate",
    university: "UC Berkeley",
    department: "Computer Science",
    year: "2nd Year",
    github: "github.com/david",
    projects: 6,
    connections: 25,
  },
  {
    id: 5,
    name: "Emma Davis",
    rank: 5,
    problemsSolved: 185,
    skillLevel: "Intermediate",
    university: "Harvard",
    department: "Computer Science",
    year: "2nd Year",
    github: "github.com/emma",
    projects: 5,
    connections: 20,
  },
];

interface ProfileModalProps {
  student: Student | null;
  onClose: () => void;
}

function ProfileModal({ student, onClose }: ProfileModalProps) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with rank */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-blue/80 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            ✕
          </button>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-blue-100">Rank #{student.rank}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Skills and Level */}
          <div>
            <h3 className="font-bold text-brand-dark mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-blue" />
              Skill Level
            </h3>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-brand-amber text-brand-dark rounded-full text-sm font-semibold">
                {student.skillLevel}
              </div>
              <p className="text-gray-600">{student.problemsSolved} problems solved</p>
            </div>
          </div>

          {/* Academic Info */}
          <div>
            <h3 className="font-bold text-brand-dark mb-3">Academic Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">University:</span>
                <span className="font-semibold text-brand-dark">{student.university}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-semibold text-brand-dark">{student.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year:</span>
                <span className="font-semibold text-brand-dark">{student.year}</span>
              </div>
            </div>
          </div>

          {/* Projects and Connections */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-brand-blue">{student.projects}</p>
              <p className="text-sm text-gray-600">Projects</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-brand-amber">{student.connections}</p>
              <p className="text-sm text-gray-600">Connections</p>
            </div>
          </div>

          {/* GitHub */}
          <div>
            <h3 className="font-bold text-brand-dark mb-3 flex items-center gap-2">
              <Github className="w-4 h-4 text-brand-dark" />
              GitHub
            </h3>
            <a
              href={`https://${student.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline text-sm"
            >
              {student.github}
            </a>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-brand-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = mockStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-brand-dark mb-4">
            Student Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            Compete with peers and climb the rankings by solving DSA problems.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Leaderboard Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-brand-blue/20 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark">
                  Problems Solved
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark">
                  Skill Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark">
                  University
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-amber flex items-center justify-center text-white font-bold text-sm">
                        {student.rank}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-brand-dark">{student.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-brand-amber" />
                      <span className="text-gray-700">{student.problemsSolved}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.skillLevel === "Expert"
                          ? "bg-red-100 text-brand-red"
                          : student.skillLevel === "Advanced"
                          ? "bg-brand-blue/10 text-brand-blue"
                          : "bg-amber-100 text-brand-amber"
                      }`}
                    >
                      {student.skillLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{student.university}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                      className="text-brand-blue hover:text-blue-600 font-semibold flex items-center gap-1"
                    >
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leaderboard Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-amber flex items-center justify-center text-white font-bold">
                    {student.rank}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.university}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <p className="font-bold text-brand-blue">{student.problemsSolved}</p>
                  <p className="text-xs text-gray-600">Problems</p>
                </div>
                <div className="bg-amber-50 rounded p-2 text-center">
                  <p className="font-bold text-brand-amber">{student.skillLevel}</p>
                  <p className="text-xs text-gray-600">Level</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStudent(student);
                  }}
                  className="bg-brand-blue text-white rounded font-semibold hover:bg-blue-600 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      <div onClick={() => setSelectedStudent(null)}>
        <ProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      </div>
    </Layout>
  );
}
