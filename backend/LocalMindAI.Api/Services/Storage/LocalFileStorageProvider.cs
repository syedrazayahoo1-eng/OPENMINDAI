namespace LocalMindAI.Api.Services.Storage;

public sealed class LocalFileStorageProvider(IConfiguration configuration) : IFileStorageProvider
{
    private readonly string _root = Path.GetFullPath(configuration["Storage:Local:RootPath"] ?? Path.Combine(AppContext.BaseDirectory, "uploads"));

    public async Task<StoredFile> SaveAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var safeName = $"{Guid.NewGuid():N}{Path.GetExtension(fileName)}";
        Directory.CreateDirectory(_root);
        var path = Path.Combine(_root, safeName);
        await using var destination = File.Create(path);
        await content.CopyToAsync(destination, cancellationToken);
        return new StoredFile(fileName, safeName, contentType, destination.Length);
    }

    public Task<Stream?> OpenReadAsync(string location, CancellationToken cancellationToken = default)
    {
        var path = Resolve(location);
        return Task.FromResult<Stream?>(File.Exists(path) ? File.OpenRead(path) : null);
    }

    public Task DeleteAsync(string location, CancellationToken cancellationToken = default)
    {
        var path = Resolve(location);
        if (File.Exists(path)) File.Delete(path);
        return Task.CompletedTask;
    }

    private string Resolve(string location)
    {
        var path = Path.GetFullPath(Path.Combine(_root, Path.GetFileName(location)));
        if (!path.StartsWith(_root, StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Invalid local storage location.");
        return path;
    }
}
