using FluentValidation;

namespace LifeOrganizer.Application.Todo.Commands.UpdateTodo
{
    public class UpdateTodoValidator : AbstractValidator<UpdateTodoCommand>
    {
        public UpdateTodoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .MaximumLength(1000);
        }
    }
}
