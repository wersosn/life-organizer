using MediatR;

namespace LifeOrganizer.Application.Export
{
    public record GetFullExportQuery : IRequest<byte[]>;
}
