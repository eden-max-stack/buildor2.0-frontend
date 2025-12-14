import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table";

interface TableComponentProps {
    tableCaption?: string;
    colNames: string[];
    bodyData: any[][];
}

export default function TableComponent({
    tableCaption,
    colNames,
    bodyData,
}: TableComponentProps) {
  return (
    <Table>
        <TableCaption>{tableCaption}</TableCaption>
        <TableHeader>
            <TableRow>
                {colNames.map((colName, index) => {
                    return <TableHead key={index}>{colName}</TableHead>
                })}
            </TableRow>
        </TableHeader>
        <TableBody>
                {bodyData.map((rowData, rowIndex) => {
                    return (
                        <TableRow key={rowIndex}>
                            {rowData.map((cellData, cellIndex) => {
                                return <TableCell key={cellIndex}>{cellData}</TableCell>
                            })}
                        </TableRow>
                    )  
                })}
        </TableBody>
    </Table>
  )
}