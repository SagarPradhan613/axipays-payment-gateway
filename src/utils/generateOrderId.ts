// Order IDs are generated client-side because the assignment API expects one up front;
// timestamp + random suffix is enough here and keeps the value readable during debugging.
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `AXI-${timestamp}-${random}`;
}
