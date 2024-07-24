import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import ProblemsTable from '../utility/CustomTable';
import { CiSquarePlus } from 'react-icons/ci';
import Pagination from '../components/Pagination';
import CustomButton from '../utility/CustomButton';
import { useParams } from 'react-router-dom';

export interface ProblemState {
  _id: string;
  title: string;
  status: string;
  dateCompleted?: string;
  dateAssigned?: string;
  attempts?: string;

  [key: string]: string | number | undefined;
}

export interface StudentState {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  numberOfAssigned: number;
  numberOfAttempted: number;
  numberOfCompleted: number;
  instructor?: string | undefined;
  assignedProblems?: ProblemState[];
  attemptedProblems?: ProblemState[];
  completedProblems?: ProblemState[];

  [key: string]: string | number | undefined | any[];
}

export interface InstructorState {
  _id: string;
  firstName: string;
  lastName: string;
}

const StudentProfilePage: React.FC = () => {
  const { username } = useParams();
  const user = {
    image1Url:
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ',
    image2Url: 'http://localhost:3000/avatar.jpg',
    role: localStorage.getItem('role'),
  };

  const [student, setStudent] = useState<StudentState | null>(null);
  const [instructor, setInstructor] = useState<InstructorState | null>(null);

  const [completedProblems, setCompletedProblems] = useState<ProblemState[]>(
    [],
  );

  const [selectedCompletedProblems, setSelectedCompletedProblems] = useState<
    Set<string>
  >(new Set());

  const [assignedProblems, setAssignedProblems] = useState<ProblemState[]>([]);
  const [selectedAssignedProblems, setSelectedAssignedProblems] = useState<
    Set<string>
  >(new Set());

  const [sortByCompleted, setSortByCompleted] = useState<string>('');
  const [sortOrderCompleted, setSortOrderCompleted] = useState<'asc' | 'desc'>(
    'asc',
  );
  const [sortByAssigned, setSortByAssigned] = useState<string>('');
  const [sortOrderAssigned, setSortOrderAssigned] = useState<'asc' | 'desc'>(
    'asc',
  );

  const [currentPageCompleted, setCurrentPageCompleted] = useState<number>(1);
  const [currentAssignedPage, setCurrentPageAssigned] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data: student } = await axios.get(
          `http://localhost:3000/users/students/${username}`,
        );

        const getArrayLength = (
          prop: any[] | string | number | undefined,
        ): number => (Array.isArray(prop) ? prop.length : 0);

        const updatedStudent: StudentState = {
          ...student,
          username: username,
          numberOfAssigned: getArrayLength(student.assignedProblems),
          numberOfAttempted: getArrayLength(student.attemptedProblems),
          numberOfCompleted: getArrayLength(student.completedProblems),
        } as StudentState;
        setStudent(updatedStudent);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };
    fetchStudent();
  }, [student]);

  useEffect(() => {
    const fetchProblems = async (url: string) => {
      try {
        const { data } = await axios.get<[]>(url);
        const updatedProblems = data.map(({ _id, title, status }) => ({
          _id,
          title,
          status,
        }));

        setCompletedProblems(
          updatedProblems.filter(({ status }) => status === 'Completed'),
        );

        setAssignedProblems(
          updatedProblems.filter(({ status }) => status === 'Assigned'),
        );
      } catch (err) {
        console.error('Error fetching problems:', err);
      }
    };

    if (student) {
      fetchProblems(`http://localhost:3000/problems/status/${student._id}`);
    }
  }, [student]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/users/instructors',
        );
        const instructorObj = response.data.find(
          (instructor: InstructorState) =>
            instructor._id === student?.instructor,
        );
        if (instructorObj) {
          const { _id, firstName, lastName } = instructorObj;
          const instructorState: InstructorState = {
            _id,
            firstName,
            lastName,
          };
          setInstructor(instructorState);
        } else {
          console.error('Instructor not found');
        }
      } catch (err) {
        console.error('Error fetching instructors:', err);
      }
    };

    if (student?.instructor) {
      fetchInstructors();
    }
  }, [student?.instructor]);

  const handleSortCompleted = (column: string) => {
    if (column === sortByCompleted) {
      setSortOrderCompleted(sortOrderCompleted === 'asc' ? 'desc' : 'asc');
    } else {
      setSortByCompleted(column);
      setSortOrderCompleted('asc');
    }
  };

  const handleSortAssigned = (column: string) => {
    if (column === sortByAssigned) {
      setSortOrderAssigned(sortOrderAssigned === 'asc' ? 'desc' : 'asc');
    } else {
      setSortByAssigned(column);
      setSortOrderAssigned('asc');
    }
  };

  const sortData = (data: any[], sortBy: string, sortOrder: 'asc' | 'desc') => {
    return data.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedCompletedProblems = sortData(
    [...completedProblems],
    sortByCompleted,
    sortOrderCompleted,
  );
  const sortedAssignedProblems = sortData(
    [...assignedProblems],
    sortByAssigned,
    sortOrderAssigned,
  );

  const indexOfLastProblemCompleted = currentPageCompleted * itemsPerPage;
  const indexOfFirstProblemCompleted =
    indexOfLastProblemCompleted - itemsPerPage;
  const currentCompletedProblems = sortedCompletedProblems.slice(
    indexOfFirstProblemCompleted,
    indexOfLastProblemCompleted,
  );

  const paginateCompleted = (pageNumber: number) => {
    setCurrentPageCompleted(pageNumber);
  };

  const indexOfLastProblemAssigned = currentAssignedPage * itemsPerPage;
  const indexOfFirstProblemAssigned = indexOfLastProblemAssigned - itemsPerPage;
  const currentAssignedProblems = sortedAssignedProblems.slice(
    indexOfFirstProblemAssigned,
    indexOfLastProblemAssigned,
  );

  const paginateAssigned = (pageNumber: number) => {
    setCurrentPageAssigned(pageNumber);
  };

  const handleSelectAllCompleted = () => {
    if (selectedCompletedProblems.size === currentCompletedProblems.length) {
      setSelectedCompletedProblems(new Set());
    } else {
      setSelectedCompletedProblems(
        new Set(currentCompletedProblems.map(problem => problem._id)),
      );
    }
  };

  const handleSelectAllAssigned = () => {
    if (selectedAssignedProblems.size === currentAssignedProblems.length) {
      setSelectedAssignedProblems(new Set());
    } else {
      setSelectedAssignedProblems(
        new Set(currentAssignedProblems.map(problem => problem._id)),
      );
    }
  };

  const handleSelectCompleted = (id: string) => {
    const newSelectedCompletedProblems = new Set(selectedCompletedProblems);
    if (newSelectedCompletedProblems.has(id)) {
      newSelectedCompletedProblems.delete(id);
    } else {
      newSelectedCompletedProblems.add(id);
    }
    setSelectedCompletedProblems(newSelectedCompletedProblems);
  };

  const handleSelectAssigned = (id: string) => {
    const newSelectedAssignedProblems = new Set(selectedAssignedProblems);
    if (newSelectedAssignedProblems.has(id)) {
      newSelectedAssignedProblems.delete(id);
    } else {
      newSelectedAssignedProblems.add(id);
    }
    setSelectedAssignedProblems(newSelectedAssignedProblems);
  };

  const columnsCompleted = [
    { header: 'Title', accessor: 'title', sortable: true },
    { header: 'Date Completed', accessor: 'dateCompleted', sortable: true },
    { header: 'Attempts', accessor: 'attempts', sortable: true },
    { header: 'Problem Page', accessor: 'link' },
  ];

  const columnsAssigned = [
    { header: 'Title', accessor: 'title', sortable: true },
    { header: 'Date Assigned', accessor: 'dateAssigned', sortable: true },
    { header: 'Attempts', accessor: 'attempts', sortable: true },
    { header: 'Problem Page', accessor: 'link' },
  ];

  const dataCompleted = currentCompletedProblems.map(problem => ({
    ...problem,
    link: (
      <Link to={`/problems/${problem._id}`} className='text-blue-500'>
        View
      </Link>
    ),
  }));

  const dataAssigned = currentAssignedProblems.map(problem => ({
    ...problem,
    link: (
      <Link to={`/problems/${problem._id}`} className='text-blue-500'>
        View
      </Link>
    ),
  }));

  if (!student) {
    return <div>Loading Student...</div>;
  }

  return (
    <div>
      <div className='container mx-auto mt-8 profile-card'>
        <ProfileCard
          username={student.username}
          firstName={student.firstName}
          lastName={student.lastName}
          email={student.email}
          instructorName={`${instructor?.firstName ?? ''} ${
            instructor?.lastName ?? ''
          }`}
          image1Url={user.image1Url}
          image2Url={user.image2Url}
          showStatsIcons={true}
          numberAssigned={student.numberOfAssigned}
          numberAttempted={student.numberOfAttempted}
          numberCompleted={student.numberOfCompleted}
        />
      </div>
      <div className='container mx-auto p-6 space-y-6'>
        <h2 className='text-3xl font-bold mb-4'>Problems Completed</h2>
        <div>
          <ProblemsTable
            data={dataCompleted}
            columns={columnsCompleted}
            selectedItems={selectedCompletedProblems}
            handleSelectAll={handleSelectAllCompleted}
            handleSelect={handleSelectCompleted}
            handleSort={handleSortCompleted}
            sortBy={sortByCompleted}
            sortOrder={sortOrderCompleted}
          />
          <Pagination
            currentPage={currentPageCompleted}
            totalItems={completedProblems.length}
            itemsPerPage={itemsPerPage}
            paginate={paginateCompleted}
          />
        </div>
      </div>

      <div className='container mx-auto p-6 space-y-6 '>
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold mb-4'>Problems Assigned</h2>
          {user.role === 'Instructor' && (
            <CustomButton
              onClick={() => {}}
              text='Assign Problem'
              icon={<CiSquarePlus className='w-6 h-7 relative text-white' />}
              className='px-6 py-3 w-48 sm:w-60 md:w-72 lg:w-96 xl:w-[210px]'
              bgColor='bg-blue-600'
              borderColor='border-blue-600'
            />
          )}
        </div>
        <div>
          <ProblemsTable
            data={dataAssigned}
            columns={columnsAssigned}
            selectedItems={selectedAssignedProblems}
            handleSelectAll={handleSelectAllAssigned}
            handleSelect={handleSelectAssigned}
            handleSort={handleSortAssigned}
            sortBy={sortByAssigned}
            sortOrder={sortOrderAssigned}
          />
          <Pagination
            currentPage={currentAssignedPage}
            totalItems={assignedProblems.length}
            itemsPerPage={itemsPerPage}
            paginate={paginateAssigned}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
