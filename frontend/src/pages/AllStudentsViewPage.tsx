import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BsFilter } from 'react-icons/bs';
import { CiExport } from 'react-icons/ci';
import Pagination from '../components/Pagination';
import CustomButton from '../utility/CustomButton';
import CustomTable from '../utility/CustomTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserPlus } from 'react-icons/fa';
import AssignProblemModal from '../components/AssignProblemModal';
import { IAttempt } from '../components/Dashboard.tsx';
import { Verdict } from '../types.tsx';

export interface StudentState {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  numberOfAssigned: number;
  numberOfAttempted: number;
  numberOfCompleted: number;
  avgCompletionTime: number;
  instructor?: string;
  [key: string]: string | number | undefined | any[];
}

export interface InstructorState {
  _id: string;
  username: string;
}

const AllStudentViewPage: React.FC = () => {
  const [students, setStudents] = useState<StudentState[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentState[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set(),
  );
  const [instructors, setInstructors] = useState<InstructorState[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentResponse = await axios.get(
          'http://localhost:3000/users/students',
        );

        const students = studentResponse.data;

        const getArrayLength = (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          prop: any[] | string | number | undefined,
        ): number => {
          if (Array.isArray(prop)) {
            return prop.length;
          }
          return 0;
        };

        const allStudentAttempts = await Promise.all(
          students.map(student =>
            axios.get('http://localhost:3000/attempts/' + student._id),
          ),
        );
        console.debug('All student attempts:', allStudentAttempts);

        const updatedStudents: StudentState[] = students.map(
          (student: StudentState) => {
            const numberOfAssigned: number = getArrayLength(
              student['assignedProblems'],
            );
            const numberOfAttempted: number = getArrayLength(
              student['attemptedProblems'],
            );
            const numberOfCompleted: number = getArrayLength(
              student['completedProblems'],
            );

            // access each attempt by ObjectID and, if the attempt is completed, add it to "timeTotal"
            let numAttempts = 0;
            let totalTime = 0;
            if (allStudentAttempts) {
              let currStudentAttempts;
              for (const studentAttempts of allStudentAttempts) {
                if (
                  studentAttempts.data.length > 0 &&
                  studentAttempts.data[0].userId === student._id
                ) {
                  currStudentAttempts = studentAttempts.data;
                  break;
                }
              }
              if (
                !currStudentAttempts ||
                typeof currStudentAttempts === 'undefined'
              ) {
                currStudentAttempts = [];
              }
              currStudentAttempts.map((attempt: IAttempt) => {
                if (
                  attempt.isPassed === Verdict.Passed &&
                  attempt.timeTaken &&
                  attempt.timeTaken !== 0
                ) {
                  numAttempts++;
                  totalTime += attempt.timeTaken;
                }
              });
            }
            const avgCompletionTime: number =
              numAttempts === 0
                ? NaN
                : Math.round(totalTime / 100 / numAttempts) / 10;

            const _id: string = student._id;
            const firstName: string = student.firstName;
            const lastName: string = student.lastName;
            const username: string = student.username;
            const instructor: string | undefined = student.instructor;

            return {
              _id,
              firstName,
              lastName,
              username,
              numberOfAssigned,
              numberOfAttempted,
              numberOfCompleted,
              avgCompletionTime,
              instructor,
            };
          },
        );

        setStudents(updatedStudents);
        setFilteredStudents(updatedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchInstructors = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/users/instructors',
        );
        setInstructors(response.data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      }
    };

    fetchStudents();
    fetchInstructors();
  }, [refreshTable]);

  useEffect(() => {
    if (selectedInstructor === '') {
      setFilteredStudents(students);
    } else {
      const selectedInstructorObj = instructors.find(
        instructor =>
          instructor.username.toLowerCase() ===
          selectedInstructor.toLowerCase(),
      );
      if (selectedInstructorObj) {
        const filtered = students.filter(
          student =>
            student.instructor &&
            student.instructor === selectedInstructorObj._id,
        );
        setFilteredStudents(filtered);
      } else {
        setFilteredStudents([]);
      }
    }
  }, [selectedInstructor, students, instructors]);

  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === '') return 0;
    let aValue = a[sortBy as keyof StudentState];
    let bValue = b[sortBy as keyof StudentState];

    if (sortBy === 'realName') {
      aValue = a.firstName;
      bValue = b.firstName;
    }

    const aString = aValue !== undefined ? aValue.toString() : '';
    const bString = bValue !== undefined ? bValue.toString() : '';
    return sortOrder === 'asc'
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });

  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = sortedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(
        new Set(filteredStudents.map(student => student._id)),
      );
    }
  };

  const handleSelect = (id: string) => {
    const newSelectedStudents = new Set(selectedStudents);
    if (newSelectedStudents.has(id)) {
      newSelectedStudents.delete(id);
    } else {
      newSelectedStudents.add(id);
    }
    setSelectedStudents(newSelectedStudents);
  };

  const handleSelectInstructor = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedInstructor(event.target.value);
  };

  const handleAssign = () => {
    setShowAssignModal(true);
  };

  const handleAssignProblems = async (
    problemIds: string[],
    studentIds: string[],
  ) => {
    const instructorEmail = localStorage.getItem('email');

    try {
      const instructorsResponse = await axios.get(
        'http://localhost:3000/users/instructors',
      );
      const instructors = instructorsResponse.data;

      const currentInstructor = instructors.find(
        (instructor: { email: string | null }) =>
          instructor.email === instructorEmail,
      );

      const instructorId = currentInstructor._id;

      for (const studentId of studentIds) {
        await axios.post('http://localhost:3000/problems/assign', {
          instructorId,
          studentId,
          problemIds,
        });
      }

      setRefreshTable(true);
      toast.success('Problems assigned successfully', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error assigning problems:', error);
      toast.error('Error assigning problems. Please try again.', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDownloadSelected = () => {
    if (selectedStudents.size === 0) {
      toast.warning(
        'No students selected. Please select at least one student to export.',
        {
          position: 'top-left',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      );
      return;
    }

    const selectedStudentData = students.filter(student =>
      selectedStudents.has(student._id),
    );

    const csvHeader = [
      'First Name',
      'Last Name',
      'Username',
      '# of Problems Assigned',
      '# of Problems Attempted',
      '# of Problems Completed',
      'Avg Completion Time (sec)',
    ];
    const csvRows = [
      csvHeader.join(','),
      ...selectedStudentData.map(student =>
        [
          student.firstName,
          student.lastName,
          student.username,
          student.numberOfAssigned,
          student.numberOfAttempted,
          student.numberOfCompleted,
          student.avgCompletionTime,
        ].join(','),
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_students.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast.success(
      `Successfully exported data for ${selectedStudentData.length} student(s).`,
      {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    );
  };

  const columns = [
    { header: 'Real Name', accessor: 'realName', sortable: true },
    { header: 'User Name', accessor: 'username', sortable: true },
    {
      header: '# of Problems Assigned',
      accessor: 'numberOfAssigned',
      sortable: true,
    },
    {
      header: '# of Problems Attempted',
      accessor: 'numberOfAttempted',
      sortable: true,
    },
    {
      header: '# of Problems Completed',
      accessor: 'numberOfCompleted',
      sortable: true,
    },
    {
      header: 'Avg Completion Time (sec)',
      accessor: 'avgCompletionTime',
      sortable: true,
    },
  ];

  const data = currentStudents.map(student => ({
    ...student,
    realName: (
      <Link
        to={`/users/students/${student.username}`}
        className='text-blue-500'
      >
        {student.firstName} {student.lastName}
      </Link>
    ),
  }));

  useEffect(() => {
    if (refreshTable) {
      setRefreshTable(false);
    }
  }, [refreshTable]);

  return (
    <div className='container mx-auto p-4 m-10'>
      <div className='mb-8'>
        <div className='flex items-center mb-4'>
          <span className='mr-4 text-black-700'>Filter by instructors:</span>
          <div className='relative w-full md:w-3/12 bg-slate-100'>
            <select
              value={selectedInstructor}
              onChange={handleSelectInstructor}
              className='border p-2 pl-10 rounded w-full bg-white'
            >
              <option value=''>Select an instructor</option>
              {instructors.map(instructor => (
                <option key={instructor._id} value={instructor.username}>
                  {instructor.username}
                </option>
              ))}
            </select>
            <BsFilter className='absolute top-3 left-3 text-gray-400' />
          </div>
        </div>
        <div className='flex justify-between'>
          <CustomButton
            onClick={handleDownloadSelected}
            text='Export Selected'
            icon={<CiExport className='w-6 h-7 relative text-white' />}
            className='w-full sm:w-72 md:w-80 lg:w-96 xl:w-[200px]'
            bgColor='bg-gray-600'
            borderColor='border-gray-600'
          />
          <CustomButton
            onClick={handleAssign}
            text='Assign Problem'
            icon={<FaUserPlus className='w-6 h-7 relative text-white' />}
            className='w-full sm:w-48 md:w-60 lg:w-84 xl:w-[200px]'
            bgColor='bg-green-600'
            borderColor='border-green-600'
          />
        </div>
      </div>
      <CustomTable
        data={data}
        columns={columns}
        selectedItems={selectedStudents}
        handleSelectAll={handleSelectAll}
        handleSelect={handleSelect}
        handleSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <Pagination
        currentPage={currentPage}
        totalItems={filteredStudents.length}
        itemsPerPage={itemsPerPage}
        paginate={paginate}
      />
      {showAssignModal && (
        <AssignProblemModal
          onClose={() => {
            setShowAssignModal(false);
            setRefreshTable(true);
          }}
          onAssign={handleAssignProblems}
          students={filteredStudents}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default AllStudentViewPage;
