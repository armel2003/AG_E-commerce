<?php
namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Firebase\JWT\JWT;

class JwtAuthenticator extends AbstractGuardAuthenticator
{
    public function getCredentials(Request $request)
    {
        $authorizationHeader = $request->headers->get('Authorization');
        if (!$authorizationHeader) {
            return null;
        }

        // Récupère le token JWT depuis l'en-tête Authorization
        $matches = [];
        preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches);
        return isset($matches[1]) ? $matches[1] : null;
    }

    public function getUser($credentials, \Symfony\Component\Security\Core\User\UserProviderInterface $userProvider)
    {
        if (null === $credentials) {
            return null;
        }

        try {
            // Décode le JWT et récupère l'utilisateur
            $decoded = JWT::decode($credentials, 'ton_secret', ['HS256']);
            return $userProvider->loadUserByUsername($decoded->username);
        } catch (\Exception $e) {
            throw new AuthenticationException('Invalid or expired token');
        }
    }

    public function checkCredentials($credentials, \Symfony\Component\Security\Core\User\UserInterface $user)
    {
        return true; // On considère que le token est valide si l'utilisateur existe
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new JsonResponse(['error' => 'Authentication failed: ' . $exception->getMessage()], JsonResponse::HTTP_UNAUTHORIZED);
    }

    public function onAuthenticationSuccess(Request $request, $token, $providerKey)
    {
        return null; // Pas besoin d'action supplémentaire
    }

    public function supportsRememberMe()
    {
        return false;
    }
}
