const express = require('express');
const path = require('path');
const fs = require('fs');
const courses = express.Router();

function getCoursesData(category) {
  try {
    const filePath = path.join(__dirname, './courses.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(data);

    if (!parsedData || !Array.isArray(parsedData.courses)) {
      console.error('Invalid courses data format');
      return { courses: [] };
    }

    if (category) {
      const categoryCourses = parsedData.courses.filter(
        (c) => c.category === category,
      );
      return { courses: categoryCourses };
    }

    const categoryMap = {};
    const limitedCourses = [];

    parsedData.courses.forEach((course) => {
      const cat = course.category;
      if (!categoryMap[cat]) {
        categoryMap[cat] = [];
      }
      if (categoryMap[cat].length < 3) {
        categoryMap[cat].push(course);
        limitedCourses.push(course);
      }
    });

    return { courses: limitedCourses };
  } catch (error) {
    console.error('Error reading courses.json:', error);
    return { courses: [] };
  }
}

courses.get('/courses', (req, res) => {
  const username = req.cookies.username;
  if (!username) {
    return res.redirect('/user/login');
  }

  if (username) {
    return res.sendFile(
      path.join(__dirname, '../../client/pages/courses.html'),
    );
  }
});

courses.post('/get-courses', (req, res) => {
  try {
    const { category } = req.body;
    const coursesData = getCoursesData(category);
    res.json(coursesData);
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Failed to load courses data' });
  }
});

// Add a new course
courses.post('/add-course', express.json(), (req, res) => {
  try {
    const coursesData = getCoursesData();
    const newCourse = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    coursesData.courses.push(newCourse);

    fs.writeFileSync(
      path.join(__dirname, './courses.json'), // Fixed the path
      JSON.stringify(coursesData, null, 2),
      'utf8',
    );

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// Update an existing course
courses.put('/update-course/:id', express.json(), (req, res) => {
  try {
    const coursesData = getCoursesData();
    const courseId = req.params.id;
    const courseIndex = coursesData.courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updatedCourse = {
      ...coursesData.courses[courseIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    // Preserve ID and creation date
    updatedCourse.id = courseId;
    updatedCourse.createdAt = coursesData.courses[courseIndex].createdAt;

    coursesData.courses[courseIndex] = updatedCourse;

    fs.writeFileSync(
      path.join(__dirname, './courses.json'), // Fixed the path
      JSON.stringify(coursesData, null, 2),
      'utf8',
    );

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
courses.delete('/delete-course/:id', (req, res) => {
  try {
    const coursesData = getCoursesData();
    const courseId = req.params.id;
    const initialLength = coursesData.courses.length;

    coursesData.courses = coursesData.courses.filter((c) => c.id !== courseId);

    if (coursesData.courses.length === initialLength) {
      return res.status(404).json({ error: 'Course not found' });
    }

    fs.writeFileSync(
      path.join(__dirname, './courses.json'), // Fixed the path
      JSON.stringify(coursesData, null, 2),
      'utf8',
    );

    res.json({ message: 'Course deleted successfully', id: courseId });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = courses;
