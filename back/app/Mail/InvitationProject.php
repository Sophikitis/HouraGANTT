<?php

namespace App\Mail;

use App\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InvitationProject extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The project instance.
     *
     * @var Project
     */
    public $project;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('houragantt-2eebaf@inbox.mailtrap.io')
                    ->subject('New invitation - Come back !')
                    ->view('email.invitationProject');
    }
}
