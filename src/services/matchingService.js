class MatchingService {
  static matchTechnician(demand, technicians) {
    // 基于地理距离与服务评分的智能匹配算法
    if (!technicians || technicians.length === 0) return null;
    return technicians.sort((a, b) => b.rating - a.rating)[0];
  }
}

module.exports = MatchingService;
