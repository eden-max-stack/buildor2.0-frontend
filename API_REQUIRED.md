# list of APIs required

## What is Required in each page

### Dashboard

1. Recently visited classes
2. Recently visited materials
3. Active Tasks
4. Recent Submissions

NOTE: these are all derived from other tables created in SQL -> a route for dashboard (GET:/dashboard) should fetch all of this information

### Classes

1. Today's Goals
2. Classes you are part of + progress in each class (you can jump back wherever you stopped)
3. Learning plan

-> these are general info directly related to each user ->

1. each user is part of multiple classes; one class has multiple students (many to many relationship)
2. each user has multiple goals within their learning plan; 1 learning plan is assigned to 1 student only (created by student) (one to many relationship student -> (many) goals)
   NOTE: a learning plan is a set of goals set by users (content of goal + deadline -> that's it)

### Classes/[classId]

1. Materials within the class: Read, Watch, Solve
2. Questions within the class
3. Tasks you are have within the class
4. People & Feedback

relationships to draw here:

1. each class/course has materials within it -> how do you create a course? we need to allow trainers to do this.

each class can be created by adding materials like in a google form. materials can either be a DSA question, an article or a video to upload.

materials and classes have a many to one relationship ((many) material -> class). a single material cannot belong to more than 1 class.

2. additionally, you can assign other questions as "tests" within the class -> "test questions" can be either DSA questions (pointing you to what is now /sandbox) and also MCQ quizzes for now. both of these get automatically graded and students get to see their grades immediately.

each of these "test questions" cannot belong to more than 1 class. they are individually recorded for each class.

3. within each class, the trainer of the class can either assign tasks to ALL students, or assign tasks to a student individually. students can have multiple tasks as well (it will be a many to many relationship ((many)task -> (many) students))

4. within the "people & feedback" section, you can see the trainer associated with each class, and the rest of the students of that class. professors can leave feedback for that particular student and they will be able to see that feedback there.

### Classes/[classId]/material/[materialId]

1. Video/Article/question
2. Transcript
3. Mark as completed
4. Metadata about material: who posted it? when did they post it? time taken to finish it

Relationships - as discussed in the previous section

1. Each material can belong to only a single class ((many) material -> class)
2. materials can be of 3 types: video, DSA question, article -> if the material is a video, you could optionally upload a transcript as well
3. how would you mark a material as completed? for now, to allow for simplicity, you can have users click a button "completed"
4. metadata of each material to be stored along with material

### Leaderboard

1. Rank, Student name, Score, Solved, Shared Classes, Trend

Not sure about this?

### Classes/[classId]/sandbox

1. Question title
2. Question description
3. Question Tags
4. Question Test cases
5. Question optimal solution

Already set.

### Profile

1. Overview: Portfolio.md, contribution graph, Recent Questions solved
2. Questions solved: all the questions that you have solved + Pagination (10 at a time)
3. Portfolio tab: professor feedback, pinned portfolio, academic info

Each user must have

1. Portfolio.md section
2. academic info: university, degree, gpa, expected grad
3. left profile card details: top skills, username, full name, class of, location, website, github
4. other url links,

other information can be fetched from other sql tables that already exist

1. recently solved questions - > from submissions, fetch the 4 most recently submitted questions
2. for the contribution graph -> check whether the student has either: submitted any question, or complete any material on a particular day to have contributed. each submission contributes 1 point, and each material has x points allotted to it (by a trainer)
