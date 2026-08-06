using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace LocalMindAI.Api.Services.Storage;

public sealed class AzureBlobStorageProvider : IFileStorageProvider
{
    private readonly BlobContainerClient _container;

    public AzureBlobStorageProvider(IConfiguration configuration)
    {
        var serviceUri = configuration["Storage:AzureBlob:ServiceUri"];
        var connectionString = configuration["Storage:AzureBlob:ConnectionString"];
        var containerName = configuration["Storage:AzureBlob:ContainerName"] ?? "uploads";
        var service = !string.IsNullOrWhiteSpace(connectionString)
            ? new BlobServiceClient(connectionString)
            : Uri.TryCreate(serviceUri, UriKind.Absolute, out var uri)
                ? new BlobServiceClient(uri, new DefaultAzureCredential())
                : throw new InvalidOperationException("Storage:AzureBlob requires a ServiceUri with managed identity or a connection string.");
        _container = service.GetBlobContainerClient(containerName);
    }

    public async Task<StoredFile> SaveAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        await _container.CreateIfNotExistsAsync(PublicAccessType.None, cancellationToken: cancellationToken);
        var name = $"{Guid.NewGuid():N}{Path.GetExtension(fileName)}";
        var blob = _container.GetBlobClient(name);
        var result = await blob.UploadAsync(content, new BlobUploadOptions { HttpHeaders = new BlobHttpHeaders { ContentType = contentType } }, cancellationToken);
        return new StoredFile(fileName, name, contentType, result.Value.ContentHash is null ? 0 : content.CanSeek ? content.Length : 0);
    }

    public async Task<Stream?> OpenReadAsync(string location, CancellationToken cancellationToken = default)
    {
        var blob = _container.GetBlobClient(location);
        if (!await blob.ExistsAsync(cancellationToken)) return null;
        return (await blob.DownloadStreamingAsync(cancellationToken: cancellationToken)).Value.Content;
    }

    public async Task DeleteAsync(string location, CancellationToken cancellationToken = default)
    {
        await _container.GetBlobClient(location).DeleteIfExistsAsync(cancellationToken: cancellationToken);
    }
}
