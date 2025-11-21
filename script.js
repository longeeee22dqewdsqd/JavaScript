const URL = "https://6911ba7f7686c0e9c20ec309.mockapi.io/api/khachhang"; 

const customerSayElement = document.getElementById('customer-say');
const testimonialLoader = document.getElementById('testimonial-loader');
const contactForm = document.querySelector('.contact-form');
const alertMessage = document.querySelector('.alert-message');
const authForms = document.querySelectorAll('.js-auth-form');
const authAlert = document.querySelector('.auth-alert');

/**
 * Hàm xáo trộn mảng (Fisher-Yates Shuffle Algorithm)
 * @param {Array} array - Mảng cần xáo trộn
 * @returns {Array} Mảng đã được xáo trộn
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

if (testimonialLoader) {
    testimonialLoader.classList.remove('d-none');
}

fetch(URL)
  .then((response) => {
    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    
    // Xáo trộn toàn bộ dữ liệu API
    const randomData = shuffleArray(data);
    
    // SỬ DỤNG TOÀN BỘ DỮ LIỆU ĐÃ XÁO TRỘN ĐỂ HIỂN THỊ
    const finalData = randomData;
    
    const htmlSegments = []; 

    finalData.forEach((element, index) => {
      // Destructure các thuộc tính cần thiết theo cấu trúc API
      const { 
          comment,            
          customerName,       
          customerAvatar,     
          projectName         
      } = element;
      
      // Chỉ item đầu tiên (index 0) được gán class 'active'
      let activeClass = index === 0 ? "active" : "";
      
      // Xây dựng cấu trúc item carousel
      htmlSegments.push(`
            <div class="carousel-item ${activeClass}">
                <div class="row g-5 align-items-center">
                    <div class="col-lg-5">
                        <img src="${customerAvatar}" class="img-fluid rounded-3 custom-client-img" alt="${customerName}" loading="lazy">
                    </div>
                    <div class="col-lg-7">
                        <p class="fs-2 fst-italic fw-light mb-4 text-muted border-left-accent">"${comment}"</p>
                        <span class="d-block fw-bold text-dark">${customerName}</span>
                        <span class="d-block text-muted">Dự án: ${projectName}</span>
                    </div>
                </div>
            </div>`);
    });
    
    if (customerSayElement) {
        // Chèn tất cả các item ngẫu nhiên vào Carousel
        customerSayElement.innerHTML = htmlSegments.join('');
        customerSayElement.parentElement?.classList.remove('disabled');
    }
    testimonialLoader?.classList.add('d-none');
  })
  .catch((err) => {
      console.error("Lỗi khi tải dữ liệu đánh giá:", err);
      if (testimonialLoader) {
          testimonialLoader.textContent = "Không thể tải đánh giá. Vui lòng kiểm tra API.";
          testimonialLoader.classList.remove('d-none');
          testimonialLoader.classList.add('text-danger');
      } else if (customerSayElement) {
          customerSayElement.innerHTML = `<div class="text-danger p-4 text-center">Không thể tải đánh giá. Vui lòng kiểm tra API.</div>`;
      }
  });

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        contactForm.classList.add('was-validated');

        const formIsValid = contactForm.checkValidity();
        if (!formIsValid) {
            if (alertMessage) {
                alertMessage.classList.remove('visually-hidden', 'alert-success');
                alertMessage.classList.add('alert', 'alert-warning');
                alertMessage.textContent = 'Please fill out the highlighted fields.';
            }
            return;
        }

        contactForm.reset();
        contactForm.classList.remove('was-validated');

        if (alertMessage) {
            alertMessage.classList.remove('visually-hidden', 'alert-warning');
            alertMessage.classList.add('alert', 'alert-success');
            alertMessage.textContent = 'Thanks! We will reach out within 24 hours.';
        }
    });
}

const syncPasswordValidation = (form) => {
    const passwordInput = form.querySelector('#registerPassword');
    const confirmInput = form.querySelector('#registerConfirmPassword');

    if (passwordInput && confirmInput) {
        confirmInput.setCustomValidity('');
        if (confirmInput.value && passwordInput.value !== confirmInput.value) {
            confirmInput.setCustomValidity('Passwords must match');
        }
    }
};

if (authForms.length > 0) {
    authForms.forEach((form) => {
        form.addEventListener('input', () => syncPasswordValidation(form));

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            syncPasswordValidation(form);
            form.classList.add('was-validated');

            if (!form.checkValidity()) {
                if (authAlert) {
                    authAlert.classList.remove('visually-hidden', 'alert-success');
                    authAlert.classList.add('alert', 'alert-warning');
                    authAlert.textContent = 'Please fix the highlighted fields.';
                }
                return;
            }

            form.reset();
            form.classList.remove('was-validated');

            if (authAlert) {
                authAlert.classList.remove('visually-hidden', 'alert-warning');
                authAlert.classList.add('alert', 'alert-success');
                const successMessage = form.dataset.success || 'Action completed successfully.';
                authAlert.textContent = successMessage;
            }
        });
    });
}