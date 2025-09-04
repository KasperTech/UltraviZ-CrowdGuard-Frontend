export const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

// Dummy function to add pagination to static data
export const fetchPaginatedData = (page, limit, data) => {
  const totalData = data.length;
  const startIndex = page * limit;
  const endIndex = (page + 1) * limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    metaData: {
      count: totalData,
      page,
      limit,
      total: totalData,
      totalPages: Math.ceil(totalData / limit),
    },
  };
};
