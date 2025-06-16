<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lists extends Model
{
    protected $table = 'lists';

    protected $fillable = [
        'title',
        'description',
        'image',
        'user_id',
    ];

    public function tasks(): HasMany
    {
        return $this->HasMany(Task::class, 'lists_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
