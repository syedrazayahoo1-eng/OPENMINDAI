namespace LocalMindAI.Api.Services.Storage;

public sealed record StoredFile(string Name, string Location, string ContentType, long Length);

public interface IFileStorageProvider
{
    Task<StoredFile> SaveAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<Stream?> OpenReadAsync(string location, CancellationToken cancellationToken = default);
    Task DeleteAsync(string location, CancellationToken cancellationToken = default);
}
