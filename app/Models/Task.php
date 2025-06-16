<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'is_completed',
        'due_date',
        'image',
        'lists_id',
    ];

    protected $casts = [
        'due_date' => 'date',
        'is_completed' => 'boolean',
    ];

    public function lists(): BelongsTo
    {
        return $this->belongsTo(Lists::class, 'lists_id');
    }
}
