/* ===========================
   PAGINATION SYSTEM
   =========================== */

class Pagination {
  constructor(items, itemsPerPage = 20) {
    this.items = items;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.totalPages = Math.ceil(items.length / itemsPerPage);
  }
  
  // Get current page items
  getCurrentPageItems() {
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    return this.items.slice(startIdx, endIdx);
  }
  
  // Go to specific page
  goToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      return true;
    }
    return false;
  }
  
  // Go to next page
  nextPage() {
    return this.goToPage(this.currentPage + 1);
  }
  
  // Go to previous page
  prevPage() {
    return this.goToPage(this.currentPage - 1);
  }
  
  // Check if has next page
  hasNext() {
    return this.currentPage < this.totalPages;
  }
  
  // Check if has previous page
  hasPrev() {
    return this.currentPage > 1;
  }
  
  // Get pagination info
  getInfo() {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      itemsPerPage: this.itemsPerPage,
      totalItems: this.items.length,
      startIndex: (this.currentPage - 1) * this.itemsPerPage,
      endIndex: Math.min(this.currentPage * this.itemsPerPage, this.items.length)
    };
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Pagination;
}
