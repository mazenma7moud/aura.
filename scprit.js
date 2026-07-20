        // ============================================
        // CONFIGURATION - بيانات البوت
        // ============================================
        const BOT_TOKEN = '8458309870:AAHHTkSR61An_6id1O46LXK7WbzBd7K9BZA';
        const CHAT_ID = '5870465762';
        const STORE_NAME = 'Aura Store';

        // ============================================
        // SHIPPING FEES - مصاريف الشحن لكل المحافظات
        // ============================================
        const shippingFees = {
            'cairo': 50,
            'giza': 50,
            'alexandria': 70,
            'qalyubia': 70,
            'menoufia': 70,
            'gharbia': 70,
            'dakahlia': 70,
            'sharkia': 70,
            'damietta': 70,
            'port_said': 70,
            'ismailia': 70,
            'suez': 70,
            'beheira': 85,
            'kafr_el_sheikh': 85,
            'fayoum': 85,
            'beni_suef': 85,
            'minya': 85,
            'asyut': 100,
            'sohag': 100,
            'qena': 100,
            'luxor': 100,
            'aswan': 100,
            'red_sea': 100,
            'new_valley': 100,
            'matrouh': 100,
            'north_sinai': 100,
            'south_sinai': 100
        };

        // ============================================
        // PRODUCTS DATA - 3 منتجات بالصور الأصلية
        // ============================================
        const products = [
            {
                id: 1,
                name: 'Velvet Violet',
                description: 'عطر فاخر برائحة البنفسج المميزة',
                price: 220,
                image: 'Aura Velvet Violet.jpg',
                badge: 'الأكثر مبيعاً'
            },
            {
                id: 2,
                name: 'Velvet Musk',
                description: 'عطر مسك أنيق يدوم طويلاً',
                price: 220,
                image: 'Aura Velvet Musk.jpg',
                badge: 'جديد'
            },
            {
                id: 3,
                name: 'Summer Solstice',
                description: 'عطر صيفي منعش بروائح الحمضيات',
                price: 220,
                image: 'Aura Summer Solstice.jpg',
                badge: 'خصم 20%'
            }
        ];

        // ============================================
        // STATE
        // ============================================
        let cart = [];
        let shippingFee = 0;

        // ============================================
        // INITIALIZATION
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Aura Store initializing...');
            renderProducts();
            updateCartUI();
            console.log('Aura Store ready!');
        });

        // ============================================
        // RENDER PRODUCTS
        // ============================================
        function renderProducts() {
            var grid = document.getElementById('productsGrid');
            if (!grid) {
                console.error('productsGrid not found!');
                return;
            }

            var html = '';
            for (var i = 0; i < products.length; i++) {
                var p = products[i];
                var badgeHtml = p.badge ? '<span class="product-badge">' + p.badge + '</span>' : '';
                html += '<div class="product-card" style="position:relative;">';
                html += badgeHtml;
                html += '<img src="' + p.image + '" alt="' + p.name + '" class="product-image" loading="lazy" onerror="this.style.display=\'none\'">';
                html += '<div class="product-info">';
                html += '<h3 class="product-name">' + p.name + '</h3>';
                html += '<p class="product-desc">' + p.description + '</p>';
                html += '</div>';
                html += '<div class="product-footer">';
                html += '<div class="product-price">' + p.price + ' <span class="currency">ج.م</span></div>';
                html += '</div>';
                html += '<button class="add-to-cart-btn" onclick="addToCart(' + p.id + ')">';
                html += '<i class="fas fa-cart-plus"></i> أضف للسلة';
                html += '</button>';
                html += '</div>';
            }
            grid.innerHTML = html;

            console.log('Products rendered:', products.length);
        }

        // ============================================
        // CART FUNCTIONS
        // ============================================
        function addToCart(productId) {
            console.log('Adding to cart:', productId);

            var product = null;
            for (var i = 0; i < products.length; i++) {
                if (products[i].id === productId) {
                    product = products[i];
                    break;
                }
            }

            if (!product) {
                console.error('المنتج مش موجود!');
                return;
            }

            var existingItem = null;
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].id === productId) {
                    existingItem = cart[i];
                    break;
                }
            }

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            console.log('Cart updated:', cart);
            updateCartUI();

            // OPEN CART SIDEBAR
            var sidebar = document.getElementById('cartSidebar');
            var overlay = document.getElementById('cartOverlay');

            if (sidebar) {
                sidebar.classList.add('active');
                console.log('Cart sidebar opened');
            } else {
                console.error('cartSidebar not found!');
            }

            if (overlay) {
                overlay.classList.add('active');
                console.log('Cart overlay opened');
            } else {
                console.error('cartOverlay not found!');
            }

            animateCartIcon();
        }

        function removeFromCart(productId) {
            var newCart = [];
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].id !== productId) {
                    newCart.push(cart[i]);
                }
            }
            cart = newCart;
            updateCartUI();
        }

        function updateQuantity(productId, change) {
            var item = null;
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].id === productId) {
                    item = cart[i];
                    break;
                }
            }
            if (!item) return;

            item.quantity += change;

            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                console.log('Quantity updated:', item.name, item.quantity);
                updateCartUI();
            }
        }

        function updateCartUI() {
            var cartItems = document.getElementById('cartItems');
            var cartCountElement = document.getElementById('cartCount');
            var cartSubtotal = document.getElementById('cartSubtotal');
            var cartShipping = document.getElementById('cartShipping');
            var cartTotal = document.getElementById('cartTotal');
            var checkoutBtn = document.getElementById('checkoutBtn');

            var totalItems = 0;
            var subtotal = 0;
            for (var i = 0; i < cart.length; i++) {
                totalItems += cart[i].quantity;
                subtotal += cart[i].price * cart[i].quantity;
            }
            var total = subtotal + shippingFee;

            if (cartCountElement) cartCountElement.textContent = totalItems;
            if (cartSubtotal) cartSubtotal.textContent = subtotal + ' ج.م';
            if (cartShipping) cartShipping.textContent = shippingFee + ' ج.م';
            if (cartTotal) cartTotal.textContent = total + ' ج.م';

            console.log('Cart UI updated - Items:', totalItems, 'Total:', total);

            if (cart.length === 0) {
                if (cartItems) {
                    cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-basket" style="font-size:4rem;opacity:0.3;display:block;margin-bottom:15px;"></i><p>السلة فارغة</p></div>';
                }
                if (checkoutBtn) checkoutBtn.disabled = true;
            } else {
                if (cartItems) {
                    var html = '';
                    for (var i = 0; i < cart.length; i++) {
                        var item = cart[i];
                        html += '<div class="cart-item">';
                        html += '<img src="' + item.image + '" alt="' + item.name + '" onerror="this.style.display=\'none\'">';
                        html += '<div class="cart-item-details">';
                        html += '<div class="cart-item-name">' + item.name + '</div>';
                        html += '<div class="cart-item-price">' + (item.price * item.quantity).toLocaleString() + ' ج.م</div>';
                        html += '<div class="cart-item-controls">';
                        html += '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', -1)"><i class="fas fa-minus"></i></button>';
                        html += '<span class="qty-value">' + item.quantity + '</span>';
                        html += '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', 1)"><i class="fas fa-plus"></i></button>';
                        html += '<button class="remove-item" onclick="removeFromCart(' + item.id + ')"><i class="fas fa-trash-alt"></i></button>';
                        html += '</div></div></div>';
                    }
                    cartItems.innerHTML = html;
                }
                if (checkoutBtn) checkoutBtn.disabled = false;
            }
        }

        function animateCartIcon() {
            var icon = document.querySelector('.cart-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                setTimeout(function() {
                    icon.style.transform = '';
                }, 200);
            }
        }

        function toggleCart() {
            var sidebar = document.getElementById('cartSidebar');
            var overlay = document.getElementById('cartOverlay');

            if (!sidebar || !overlay) return;

            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        }

        // ============================================
        // SHIPPING UPDATE
        // ============================================
        function updateShipping() {
            var governorate = document.getElementById('customerGovernorate');
            if (governorate) {
                shippingFee = shippingFees[governorate.value] || 0;
                console.log('Shipping updated:', governorate.value, shippingFee + 'ج.م');
                updateCartUI();

                // Update order summary if checkout is open
                var checkoutModal = document.getElementById('checkoutModal');
                if (checkoutModal && checkoutModal.classList.contains('active')) {
                    openCheckout();
                }
            }
        }

        // ============================================
        // CHECKOUT MODAL
        // ============================================
        function openCheckout() {
            if (cart.length === 0) return;

            var modal = document.getElementById('checkoutModal');
            var overlay = document.getElementById('modalOverlay');
            var summary = document.getElementById('orderSummary');

            if (!modal || !overlay || !summary) return;

            var subtotal = 0;
            for (var i = 0; i < cart.length; i++) {
                subtotal += cart[i].price * cart[i].quantity;
            }
            var total = subtotal + shippingFee;

            var html = '<h4><i class="fas fa-receipt"></i> ملخص الطلب</h4>';
            for (var i = 0; i < cart.length; i++) {
                html += '<div class="summary-item"><span>' + cart[i].name + ' × ' + cart[i].quantity + '</span><span>' + (cart[i].price * cart[i].quantity).toLocaleString() + ' ج.م</span></div>';
            }
            html += '<div class="summary-item"><span>مصاريف الشحن</span><span>' + shippingFee + ' ج.م</span></div>';
            html += '<div class="summary-item total"><span>الإجمالي الكلي</span><span>' + total.toLocaleString() + ' ج.م</span></div>';
            summary.innerHTML = html;

            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Close cart sidebar
            toggleCart();
        }

        function closeCheckout() {
            var modal = document.getElementById('checkoutModal');
            var overlay = document.getElementById('modalOverlay');

            if (modal) modal.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // ============================================
        // SUBMIT ORDER TO TELEGRAM
        // ============================================
        async function submitOrder(event) {
            event.preventDefault();

            var name = document.getElementById('customerName').value.trim();
            var phone = document.getElementById('customerPhone').value.trim();
            var governorate = document.getElementById('customerGovernorate');
            var address = document.getElementById('customerAddress').value.trim();
            var notes = document.getElementById('customerNotes').value.trim();

            if (!name || !phone || !address || !governorate.value) {
                alert('من فضلك أكمل جميع البيانات المطلوبة');
                return;
            }

            var subtotal = 0;
            for (var i = 0; i < cart.length; i++) {
                subtotal += cart[i].price * cart[i].quantity;
            }
            var total = subtotal + shippingFee;
            var governorateText = governorate.options[governorate.selectedIndex].text;

            function esc(s) {
                return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }

            var message = '🛒 <b>طلب جديد من ' + esc(STORE_NAME) + '</b>\n';
            message += '━━━━━━━━━━━━━━━━━━━━\n\n';
            message += '👤 <b>العميل:</b> ' + esc(name) + '\n';
            message += '📱 <b>الهاتف:</b> ' + esc(phone) + '\n';
            message += '📍 <b>المحافظة:</b> ' + esc(governorateText) + '\n';
            message += '🏠 <b>العنوان:</b> ' + esc(address) + '\n';
            if (notes) message += '📝 <b>ملاحظات:</b> ' + esc(notes) + '\n';
            message += '\n📦 <b>المنتجات:</b>\n';

            for (var i = 0; i < cart.length; i++) {
                var item = cart[i];
                message += '\n' + (i + 1) + '. ' + esc(item.name) + '\n';
                message += '   الكمية: ' + item.quantity + ' | السعر: ' + item.price.toLocaleString() + ' ج.م\n';
                message += '   المجموع: ' + (item.price * item.quantity).toLocaleString() + ' ج.م\n';
            }

            message += '\n━━━━━━━━━━━━━━━━━━━━\n';
            message += '📦 <b>المجموع:</b> ' + subtotal.toLocaleString() + ' ج.م\n';
            message += '🚚 <b>الشحن:</b> ' + shippingFee + ' ج.م\n';
            message += '💰 <b>الإجمالي الكلي:</b> ' + total.toLocaleString() + ' ج.م\n';
            message += '⏰ <b>تاريخ الطلب:</b> ' + new Date().toLocaleString('ar-EG') + '\n';

            var loading = document.getElementById('loading');
            if (loading) loading.classList.add('active');

            // ==== التعديل الوحيد: timeout عشان لو علّق يقفل الـ loading ====
            var timeoutId = setTimeout(function() {
                if (loading) loading.classList.remove('active');
                alert('❌ الطلب استغرق وقت طويل. تحقق من الاتصال بالنت.');
            }, 15000);

            try {
                var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
                console.log('Sending to URL:', url);

                var response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });

                clearTimeout(timeoutId);

                var data = await response.json();
                console.log('Telegram response:', data);

                if (loading) loading.classList.remove('active');

                if (data.ok) {
                    closeCheckout();
                    toggleCart();
                    cart = [];
                    shippingFee = 0;
                    updateCartUI();
                    document.getElementById('checkoutForm').reset();
                    var successMsg = document.getElementById('successMessage');
                    if (successMsg) successMsg.classList.add('active');
                } else {
                    alert('❌ حدث خطأ أثناء إرسال الطلب: ' + data.description);
                }
            } catch (error) {
                clearTimeout(timeoutId);
                if (loading) loading.classList.remove('active');
                alert('❌ فشل الاتصال بتلجرام: ' + error.message);
                console.error('Error:', error);
            }
        }

        function closeSuccess() {
            var successMsg = document.getElementById('successMessage');
            if (successMsg) successMsg.classList.remove('active');
            document.body.style.overflow = '';
        }

        // ============================================
        // EVENT LISTENERS
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            var modalOverlay = document.getElementById('modalOverlay');
            var cartOverlay = document.getElementById('cartOverlay');

            if (modalOverlay) modalOverlay.addEventListener('click', closeCheckout);
            if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeCheckout();
                var cartSidebar = document.getElementById('cartSidebar');
                if (cartSidebar && cartSidebar.classList.contains('active')) {
                    toggleCart();
                }
                var successMsg = document.getElementById('successMessage');
                if (successMsg && successMsg.classList.contains('active')) {
                    closeSuccess();
                }
            }
        });
