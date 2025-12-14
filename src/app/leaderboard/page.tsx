import TableComponent from "@/components/container-components/TableComponent";

export default function Leaderboard() {
    return (
        <div>
            <h1>hi this is the leaderboard page</h1>
            <div>
                <TableComponent
                    tableCaption="Leaderboard Rankings"
                    colNames={["Rank", "Name", "Score", "Skill Level"]}
                    bodyData={[
                        [1, "Alice", 1500, "Expert"],
                        [2, "Bob", 1200, "Intermediate"],
                        [3, "Charlie", 1000, "Beginner"],
                    ]}
                />
            </div>
        </div>
    )
}