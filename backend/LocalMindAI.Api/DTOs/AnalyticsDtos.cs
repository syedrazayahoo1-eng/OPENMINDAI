namespace LocalMindAI.Api.DTOs;
public sealed class AnalyticsRangeQuery { public string Period { get; init; } = "30d"; public DateTime? StartDate { get; init; } public DateTime? EndDate { get; init; } }
public sealed class AnalyticsPointDto { public DateTime Date { get; init; } public decimal Value { get; init; } public string? Label { get; init; } }
public sealed class AnalyticsSliceDto { public string Name { get; init; } = string.Empty; public decimal Value { get; init; } }
public sealed class AnalyticsDto { public DateTime StartDate { get; init; } public DateTime EndDate { get; init; } public Dictionary<string, object?> Metrics { get; init; } = []; public IReadOnlyList<AnalyticsPointDto> Series { get; init; } = []; public IReadOnlyList<AnalyticsSliceDto> Distribution { get; init; } = []; }
