

let activeall;

// Loading category data
const loadCategory = async () => {
    const response = await fetch("https://openapi.programming-hero.com/api/videos/categories");
    const categories = await response.json();
    displayCategory(categories.data);
};

// Loading video data
const loadData = async (category_id = 1000) => {
    activeall = category_id;
    const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${category_id}`);
        const data = await response.json();
        displayData(data.data);
};

// Displaying categories
const displayCategory = (categories) => {
    const categoryOption = document.getElementById("category-option");
    categoryOption.innerHTML = '';
    categories.forEach((data) => {
        const categoryButton = document.createElement("button");
        categoryButton.classList.add("btn", "btn-secondary", "me-2", "mb-2");
        categoryButton.textContent = data.category;
        categoryButton.addEventListener("click", (event) => {
           
            document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('btn-red'));
            event.target.classList.add("btn-red");
            loadData(data.category_id);
        });

        categoryOption.appendChild(categoryButton);
    });
    activeall = 1000;
    loadData();
};

// Displaying categories data/videos
const displayData = (videoData) => {
    const categoryVideos = document.getElementById("category-videos");
    const noContent = document.getElementById("no-content-section");
    categoryVideos.innerHTML = '';
    noContent.innerHTML = '';

    if (videoData.length === 0) {
        const noContentBox = document.createElement("div");
        noContentBox.classList.add("text-center", "mt-5");
        noContentBox.innerHTML = `
            <div>
                <img src="./no-content.png" alt="">
            </div>
            <p class="text-dark fw-bold fs-3 mt-5">Oops!! Sorry, There is no content here</p>
        `;
        noContent.appendChild(noContentBox);
    } else {
        let rowDiv;
        videoData.forEach((video, index) => {
            if (index % 4 === 0) {
                rowDiv = document.createElement("div");
                rowDiv.classList.add("row", "mb-3");
                categoryVideos.appendChild(rowDiv);
            }

            const { thumbnail, title, authors, others } = video;
            const profilePic = authors[0].profile_picture;
            const profileName = authors[0].profile_name;
            let verified = authors[0].verified ? `<img src='./verified-icon.png'>` : '';
            const views = others.views;
            let postDate = others.posted_date;

            if (postDate !== '') {
                const hr = Math.round(postDate / 3600);
                const min = Math.round((postDate % 3600) / 60);
                postDate = `${hr}hrs ${min}min ago`;
            }

            const videoCard = document.createElement("div");
            videoCard.classList.add("col-md-3");
            videoCard.innerHTML = `
            <div class="card h-100 border-0">
    <img src="${thumbnail}" class="card-img-top thumbnail-img" alt="...">
    <div class="position-absolute bottom-3 end-3">
    <p class="bg-dark text-white rounded py-1.5 px-1 fs-6">${postDate}</p>
</div>

    <div class="card-body">
        <div class="d-flex align-items-center mt-2">
            <div class="profile-avatar me-3">
                <img src="${profilePic}" class="rounded-circle" style="width: 32px; height: 32px;" alt="Profile Pic">
            </div>
            <div class="details">
                <h5 class="card-title mb-0">${title}</h5>
                <p class="card-text mb-0">${profileName} ${verified}</p>
                <p class="card-text">${views}</p>
                
            </div>
        </div>
    </div>
</div>

            `;
            rowDiv.appendChild(videoCard);
        });
    }
};

// Sorting categories data/video by views
const sortByView = async () => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${activeall}`);
        const data = await res.json();
        const activeViewData = data.data;

        if (activeViewData.length !== 0) {
            const sortedData = activeViewData.sort((v1, v2) => parseFloat(v2.others.views) - parseFloat(v1.others.views));
            displayData(sortedData);
        } else {
            console.log("There Is No Data To Sort");
        }
    } catch (error) {
        console.error("Error sorting data:", error);
    }
};

loadCategory();
