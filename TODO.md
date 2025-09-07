# Fix Profile Saving Issues

## Issues Identified
- Gender and Date of Birth not saving in profile update
- Address not saving due to missing backend routes
- Profile data (phone, dateOfBirth, gender, addresses) not returned from backend

## Tasks
- [x] Update `backend/controllers/authController.js`:
  - Modify `updateUserProfile` to handle phone, dateOfBirth, gender
  - Modify `getUserProfile` to return all user fields including phone, dateOfBirth, gender, addresses
  - Add address management functions: addAddress, updateAddress, deleteAddress, setDefaultAddress
- [x] Update `backend/routes/authRoutes.js`:
  - Add routes for address CRUD: POST /profile/addresses, PUT /profile/addresses/:id, DELETE /profile/addresses/:id, PUT /profile/addresses/:id/default
- [ ] Test profile update for gender and dateOfBirth
- [ ] Test address saving functionality
