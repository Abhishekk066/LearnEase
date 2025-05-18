const breadcrumb = document.querySelector('.breadcrumb');

async function fetchCourses() {
  const categoryUrl = window.location.href.toString().split('=')[1];
  try {
    const response = await fetch('/get-courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category: categoryUrl }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const coursesByCategory = data.courses.reduce((acc, course) => {
      const category = course.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(course);
      return acc;
    }, {});

    const mainContainer = document.querySelector('.all-courses');

    for (const [category, categoryCourses] of Object.entries(
      coursesByCategory,
    )) {
      const section = document.createElement('section');
      section.className = 'featured-courses';
      section.innerHTML = `
          <div class="container">
            <div class="section-header">
              <h2 class="section-title">${category}</h2>
              <a href="/courses?category=${encodeURIComponent(
                category,
              )}" class="view-all">View All</a>
            </div>
            <div class="course-slider" id="slider-${category
              .replace(/\s+/g, '-')
              .toLowerCase()}"></div>
          </div>
        `;

      mainContainer.appendChild(section);

      // Add courses to this category's slider
      const slider = document.getElementById(
        `slider-${category.replace(/\s+/g, '-').toLowerCase()}`,
      );
      slider.innerHTML = categoryCourses
        .map(
          (course) => `
          <div class="course-card">
            <div class="course-image">
              <img src="${'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}"
                   alt="${course.course_title}">
              ${
                course.badge
                  ? `<div class="course-badge">${course.badge}</div>`
                  : ''
              }
            </div>
            <div class="course-content">
              <div class="course-info">
                <span class="course-category">${category}</span>
                ${
                  course.course_rating
                    ? `
                <span class="course-rating">
                  <i class="fas fa-star"></i>${course.course_rating}
                </span>`
                    : ''
                }
              </div>
              <h3 class="course-title">${course.course_title}</h3>
              <p class="course-instructor">${
                course.instructor || 'Unknown Instructor'
              }</p>
              <div class="course-meta">
                <span><i class="fas fa-video"></i> ${
                  course.total_lesson || 0
                } lessons</span>
                <span><i class="fas fa-clock"></i> ${course.time_count}</span>
              </div>
              <div class="course-footer">
                <span class="course-price">${
                  course.course_price || '0.00'
                }</span>
                <a href="/courses/${course.id}" class="btn">View Details</a>
              </div>
            </div>
          </div>
        `,
        )
        .join('');

      if (categoryUrl !== undefined) {
        breadcrumb.innerHTML = '';
        breadcrumb.innerHTML = `
      <li class="breadcrumb-item"><a href="/">Home</a></li>
      <li class="breadcrumb-item"><a href="/courses">Courses</a></li>
      <li class="breadcrumb-item"><a href="/courses?category=${categoryUrl}">${categoryUrl}</a></li>
    `;
        document
          .querySelectorAll('.view-all')
          .forEach((e) => (e.style.display = 'none'));
      }
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    const fallbackSection = document.createElement('section');
    fallbackSection.className = 'featured-courses';
    fallbackSection.innerHTML = `
        <div class="container">
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load courses. Please try again later.</p>
          </div>
        </div>
      `;
    document.querySelector('main').appendChild(fallbackSection);
  }
}

// document.querySelectorAll('a').forEach((e) =>
//   e.addEventListener('click', () => {
//     console.log(e.href);
//   }),
// );
document.addEventListener('DOMContentLoaded', fetchCourses);
