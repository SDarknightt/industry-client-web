import React from "react";

interface Column {
  header: string;
  objectMap: string;
  reactNode?: (row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function TableComponent({
  columns,
  data,
  onRowClick,
}: TableProps) {
  return (
    <div className="overflow-x-auto border border-light-green rounded-lg">
        <table className="w-full text-left table-auto min-w-125 overflow-auto">
            <thead className="bg-primary text-white uppercase">
                <tr>
                {columns.map((col, index) => (
                    <th key={index} className="p-4 border-b">
                    <p className="text-sm font-semibold">{col.header}</p>
                    </th>
                ))}
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-graphite">
                {data.map((row, rowIndex) => (
                    <tr key={(row as any)?.id || rowIndex}
                        className="hover:bg-gray-50 border-y-2 border-[#E9ECE9] cursor-pointer"
                        onClick={() => onRowClick?.(row)}
                    >
                        {columns.map((col, colIndex) => (
                            <td
                                key={colIndex}
                                className={`p-4 text-sm text-gray-900`}
                                onClick={(e) => col.reactNode && e.stopPropagation()}
                            >
                                {col.reactNode ? col.reactNode(row) : row[col.objectMap] ?? "-"}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}