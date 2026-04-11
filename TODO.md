1. we currently track whether a session is active or not using the auth protection logic in middleware.ts (under src\middleware.ts). i would like for things to reflect in the navbar (under src\components\navbar.tsx) such that if the user is not logged in, the 4 icons: dark/light mode, notifications bell, profile icon and sign out just become a blue "sign in" button redirecting me to "/auth/login".... if the user's session is active, go ahead and have the navbar be as is.

2. the dashboard/ (under src\app\dashboard\page.tsx) must fetch data from the backend apis to fetch tasks, classes, materials, and recent submissions in questions.

3. currently, any question under the classes/{classId} page (under src\app\classes\[classId]\page.tsx) is always redirected to /classes/${classInfo.id}/sandbox?id=597d8c2e-4b1a-4f92-9a3c-8e7d2f1b0a54 -> we should redirect it to classes/{classId}/sandbox?id=question.id.... - this requires us to populate the questions DB

4. we must look into making 5 calls when visiting the classes/[classId] page (under src\app\classes\[classId]\page.tsx) bcz it fetches all tasks assigned within that class, all the materials + phases for a class, all questions for a class, and people & feedback....

5.
