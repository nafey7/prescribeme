import React, { useState } from 'react';
import { SearchBar, Badge, Button } from '../../common';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: number;
  hospital: string;
  availability: string;
  acceptingNewPatients: boolean;
  languages: string[];
  distance: string;
}

const DoctorList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');

  // Mock data - replace with actual API call
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Smith',
      specialty: 'Internal Medicine',
      rating: 4.9,
      reviewCount: 156,
      experience: 15,
      hospital: 'City Medical Center',
      availability: 'Available Today',
      acceptingNewPatients: true,
      languages: ['English', 'Spanish'],
      distance: '0.5 miles',
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.8,
      reviewCount: 203,
      experience: 20,
      hospital: 'Heart Health Institute',
      availability: 'Next available: Nov 25',
      acceptingNewPatients: true,
      languages: ['English', 'Mandarin'],
      distance: '1.2 miles',
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      rating: 5.0,
      reviewCount: 89,
      experience: 10,
      hospital: 'Children\'s Health Center',
      availability: 'Available Tomorrow',
      acceptingNewPatients: true,
      languages: ['English', 'Spanish', 'Portuguese'],
      distance: '2.1 miles',
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      rating: 4.7,
      reviewCount: 142,
      experience: 18,
      hospital: 'Orthopedic Specialists',
      availability: 'Next available: Dec 1',
      acceptingNewPatients: false,
      languages: ['English'],
      distance: '3.5 miles',
    },
    {
      id: '5',
      name: 'Dr. Lisa Patel',
      specialty: 'Dermatology',
      rating: 4.9,
      reviewCount: 198,
      experience: 12,
      hospital: 'Skin Care Clinic',
      availability: 'Available Today',
      acceptingNewPatients: true,
      languages: ['English', 'Hindi', 'Gujarati'],
      distance: '1.8 miles',
    },
  ];

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties
  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search for doctors by name, specialty, or location
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar
            placeholder="Search by doctor name, specialty, or hospital..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1"
          />
          <div className="flex items-center space-x-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <svg
                className="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredDoctors.length}</span> doctors
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
        <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>Sort by: Relevance</option>
          <option>Sort by: Rating</option>
          <option>Sort by: Distance</option>
          <option>Sort by: Availability</option>
        </select>
      </div>

      {/* Doctor List */}
      <div className="space-y-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              {/* Doctor Photo */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-2xl">
                    {doctor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {doctor.name}
                      </h3>
                      {doctor.acceptingNewPatients && (
                        <Badge variant="success" size="sm">
                          Accepting New Patients
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{doctor.specialty}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {doctor.rating} ({doctor.reviewCount} reviews)
                      </span>
                      <span>•</span>
                      <span>{doctor.experience} years experience</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {doctor.distance}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <Button variant="primary" className="btn-gradient text-white">
                      Book Appointment
                    </Button>
                    <Button variant="secondary" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Hospital</p>
                      <p className="text-sm font-medium text-gray-900">
                        {doctor.hospital}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Availability</p>
                      <p className="text-sm font-medium text-gray-900">
                        {doctor.availability}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Languages</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doctor.languages.map((language) => (
                          <Badge key={language} variant="default" size="sm">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
