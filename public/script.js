const menuBtn = document.querySelector(".menu-icon span");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const items = document.querySelector(".header-items");
const form = document.querySelector("form");
  
menuBtn.onclick = () => {
items.classList.add("active");
menuBtn.classList.add("hide");
searchBtn.classList.add("hide");
cancelBtn.classList.add("show");
}
cancelBtn.onclick = () => {
items.classList.remove("active");
menuBtn.classList.remove("hide");
searchBtn.classList.remove("hide");
cancelBtn.classList.remove("show");
form.classList.remove("active");
}

searchBtn.onclick = () => {
form.classList.add("active");
searchBtn.classList.add("hide");
cancelBtn.classList.add("show");
}
  

  
  // Check if the element exists before adding the event listener
  function toggleReviewText(seeMoreSpan) {
    const reviewText = seeMoreSpan.previousElementSibling;
    if (reviewText.style.display === "none") {
      reviewText.style.display = "inline";
      seeMoreSpan.textContent = "See Less...";
    } else {
      reviewText.style.display = "none";
      seeMoreSpan.textContent = "See More...";
    }
  }
  
// Get all review cards
const reviewCards = document.querySelectorAll('.review-card');

// Function to toggle edit form
function toggleEditForm(reviewId) {
const editForm = document.getElementById(`edit-form-${reviewId}`);
if (editForm.style.display === 'none') {
editForm.style.display = 'block';
} else {
editForm.style.display = 'none';
}
}

// Function to toggle delete form
function toggleDeleteForm(reviewId) {
const deleteForm = document.getElementById(`delete-form-${reviewId}`);
if (deleteForm.style.display === 'none') {
deleteForm.style.display = 'block';
} else {
deleteForm.style.display = 'none';
}
}
  

