interface TableColumn {
  header: string;
  accessor: string;
  sortable?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CustomTableProps<T extends Record<string, any>> {
  data: T[];
  columns: TableColumn[];
  selectedItems: Set<string>;
  handleSelectAll: () => void;
  handleSelect: (id: string) => void;
  handleSort: (column: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTable = <T extends Record<string, any>>({
  data,
  columns,
  selectedItems,
  handleSelectAll,
  handleSelect,
  handleSort,
  sortBy,
  sortOrder,
}: CustomTableProps<T>) => {
  return (
    <table className='min-w-full bg-white text-center'>
      <thead>
        <tr>
          <th className='py-2 px-4 border-b cursor-pointer'>
            <input
              type='checkbox'
              checked={selectedItems.size === data.length}
              onChange={handleSelectAll}
              className='form-checkbox'
            />
          </th>
          {columns.map(column => (
            <th
              key={column.accessor}
              className={`py-2 px-4 border-b ${
                column.sortable ? 'cursor-pointer' : ''
              }`}
              onClick={
                column.sortable ? () => handleSort(column.accessor) : undefined
              }
            >
              {column.header}
              {sortBy === column.accessor && (
                <span className='ml-1'>{sortOrder === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map(item => (
            <tr
              key={item['_id']}
              className={selectedItems.has(item['_id']) ? 'bg-gray-200' : ''}
            >
              <td className='py-2 px-4 border-b'>
                <input
                  type='checkbox'
                  checked={selectedItems.has(item['_id'])}
                  onChange={() => handleSelect(item['_id'])}
                  className='form-checkbox'
                />
              </td>
              {columns.map(column => (
                <td
                  key={column.accessor}
                  className={`py-2 px-4 border-b ${
                    columns.length < 5 ? 'max-w-10' : ''
                  }`}
                >
                  {item[column.accessor]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td className='py-2 px-4 border-b' colSpan={columns.length + 1}>
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CustomTable;
