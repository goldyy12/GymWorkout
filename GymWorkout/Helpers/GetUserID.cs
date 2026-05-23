using System.Security.Claims;

namespace GymWorkout.Helpers
{
    public static class ClaimsPrincipalExtensions
    {
        public static int? GetCurrentUserId(this ClaimsPrincipal user)
        {
            var userIdString = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString) ||
                !int.TryParse(userIdString, out int userId))
            {
                return null;
            }

            return userId;
        }
    }
}