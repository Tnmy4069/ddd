# Admin Message Management

This document describes the admin functionality for managing community messages in the RoboAnalyzer application.

## Features

### 1. Message Editing (Admin Only)
- Admins can edit any message in the community chat
- Edited messages are marked with an "(edited)" indicator
- Original timestamp and edit timestamp are both preserved
- Real-time updates in the community chat interface

### 2. Message Deletion (Admin Only)  
- Admins can permanently delete any message
- Confirmation dialog prevents accidental deletions
- Immediate removal from all user interfaces

### 3. Admin UI Components

#### Community Chat Page (`/community`)
- Admin users see edit and delete buttons on all messages
- Inline editing with save/cancel options
- Admin badge displayed in header
- Admin mode indicator in chat title

#### Admin Dashboard (`/admin`)
- Dedicated "Message Management" section
- Bulk message overview with editing capabilities
- Enhanced admin controls for message moderation

#### Standalone Admin Message Manager
- Reusable component (`AdminMessageManager.js`)
- Can be embedded in any admin interface
- Full CRUD operations for messages

## API Endpoints

### Edit Message
```
PUT /api/messages/[messageId]
```
**Headers:**
- Content-Type: application/json
- Credentials: include (for authentication)

**Body:**
```json
{
  "content": "Updated message content"
}
```

**Response:**
```json
{
  "message": {
    "id": "messageId",
    "content": "Updated message content",
    "username": "username",
    "edited": true,
    "editedAt": "2024-12-19T10:30:00Z",
    "createdAt": "2024-12-19T10:00:00Z"
  }
}
```

### Delete Message
```
DELETE /api/messages/[messageId]
```
**Headers:**
- Credentials: include (for authentication)

**Response:**
```json
{
  "message": "Message deleted successfully"
}
```

## Security

- All admin operations require the user to have `role: 'admin'`
- Authentication is verified through the `withAuth` middleware
- Unauthorized requests return 403 Forbidden
- Non-existent messages return 404 Not Found

## Database Schema

The `Message` model has been updated to support editing:

```javascript
{
  // ... existing fields ...
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}
```

## Usage Examples

### Admin Editing a Message
1. Admin clicks the edit icon on any message
2. Message content becomes editable in an input field
3. Admin modifies the content and clicks "Save"
4. Message is updated with "edited" indicator
5. All users see the updated message immediately

### Admin Deleting a Message
1. Admin clicks the delete icon on any message
2. Confirmation dialog appears
3. Admin confirms the deletion
4. Message is permanently removed from all interfaces

## Error Handling

- Input validation prevents empty messages
- Character limit enforcement (1000 characters)
- Network error handling with user feedback
- Graceful fallbacks for failed operations

## Future Enhancements

- Message history/audit trail
- Bulk message operations
- Message reporting system
- Automated moderation rules
- Admin activity logging
