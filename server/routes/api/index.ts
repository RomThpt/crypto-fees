export default defineEventHandler((event) => {
  // Redirect to API docs
  sendRedirect(event, '/api-docs', 302)
})
